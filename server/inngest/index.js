import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

// Inngest client
export const inngest = new Inngest({ id: "social-marketplaces" });

/**
 * CREATE / SYNC USER
 */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    const email = data?.email_addresses?.[0]?.email_address;
    if (!email) return; // hard stop, avoid prisma crash

    const name = `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim();
    const image = data?.image_url ?? "";

    const existingUser = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: data.id },
        data: { email, name, image },
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: data.id,
        email,
        name,
        image,
      },
    });
  }
);

/**
 * DELETE USER (SAFE)
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    const listingsCount = await prisma.listing.count({
      where: { ownerId: data.id },
    });

    const chatsCount = await prisma.chat.count({
      where: {
        OR: [
          { ownerUserId: data.id },
          { chatUserId: data.id },
        ],
      },
    });

    const transactionsCount = await prisma.transaction.count({
      where: { userId: data.id },
    });

    // If no dependencies → safe delete
    if (
      listingsCount === 0 &&
      chatsCount === 0 &&
      transactionsCount === 0
    ) {
      await prisma.user.deleteMany({
        where: { id: data.id },
      });
      return;
    }

    // Otherwise deactivate listings
    await prisma.listing.updateMany({
      where: { ownerId: data.id },
      data: { status: "inactive" },
    });
  }
);

/**
 * UPDATE USER
 */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    const email = data?.email_addresses?.[0]?.email_address;
    if (!email) return;

    const name = `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim();
    const image = data?.image_url ?? "";

    await prisma.user.updateMany({
      where: { id: data.id },
      data: { email, name, image },
    });
  }
);


// Inngest function to send purchase email to the customer

const sendPurchaseEmail = inngest.createFunction(
  { id: "send-purchase-email" },
  { event: "app/purchase" },
  async ({ event }) => {
    const { transaction } = event.data;

    const customer = await prisma.user.findFirst({
      where: {id: transaction.userId}
    })

    const listing = await prisma.listing.findFirst({
      where: {id: transaction.listingId}
    })

    const credential = await prisma.credential.findFirst({
      where: {listingId: transaction.listingId}
    })

    await sendEmail({
      to: customer.email,
      subject: `Your Credentials for the account you purchased`,
      html: `
      <h2>Thank you for purchasing account @${listing.username} of ${listing.platform} platform</h2>
      <p>Here are your credentials for the listing you purchased.</p>
      <h3>New Credentials</h3>
      <div>
      ${credential.updatedCredential.map((cred)=>`<p>${cred.name}: ${cred.value}</p>`).join("")}
      </div>
      <p>If you any questions, please contact us at <a href="mailto:support@gmail.com">support@example.com</a></p>
      
      `,
    })

  }
);

// Inngest Function to send new credentials for deleted listings

const sendNewCredentials = inngest.createFunction(
  {id: 'send-new-credentials'},
  {event: "app/listing-deleted"},

  async({event})=>{
    const {listing, listingId} = event.data
    
    const newCredential = await prisma.credential.findFirst({
      where: {listingId},
    })
    if(newCredential){
      await sendEmail({
        to: listing.owner.email,
        subject: "New Credentials for you listing",
        html: `
            <h2>Your new credentials for your deleted listing : </h2>
            title : ${listing.title}
            <br/>
            username: ${listing.username}
            <br/>
            platform: ${listing.platform}
            <br/>
            <h3>New Credentials</h3>
            <div>
            ${newCredential.updatedCredential.map((cred)=>`<p>${cred.name}: ${cred.value}</p>`).join("")}
            </div>
            <h3>Old Credentials</h3>
            <div>
            ${newCredential.originalCredential.map((cred)=>`<p>${cred.name}: ${cred.value}</p>`).join("")}
            </div>
            <p>If you any questions, please contact us at <a href="mailto:support@gmail.com">support@example.com</a></p>
        
        `
      })
    }
  }

)

// Export functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  sendPurchaseEmail,
  sendNewCredentials

];