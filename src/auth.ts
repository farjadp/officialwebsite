import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import Resend from "next-auth/providers/resend" 
// Uncomment when you have Resend API Key

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        // Placeholder for Email provider
        // Resend({
        //   from: "onboarding@resend.dev",
        // }),
        // Temporary Credentials provider for development
        Credentials({
            credentials: {
                email: {},
            },
            authorize: async (credentials) => {
                // TODO: Implement actual user lookup
                if (credentials.email === "admin@example.com") {
                    return {
                        id: "1",
                        name: "Admin",
                        email: "admin@example.com",
                        role: "OWNER"
                    }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
})
