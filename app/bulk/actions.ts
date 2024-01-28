import { auth } from "@/libs/auth";
import { isAdmin } from "@/libs/checkPermission";

export async function resetGames() {
    const session = await auth();
    if (!isAdmin(session)) return new Response('Unauthorized', { status: 401 });
    
}

export async function resetVenues() {
    const session = await auth();
    if (!isAdmin(session)) return new Response('Unauthorized', { status: 401 });
    
    
}