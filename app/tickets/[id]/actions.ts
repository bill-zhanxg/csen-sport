'use server'

import { getXataClient } from "@/libs/xata";

const xata = getXataClient();

export async function closeTicket(id: string) {
    if (typeof id !== 'string') return;
    return xata.db.tickets.update(id, { closed: true });
}