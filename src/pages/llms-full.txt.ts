import type { APIRoute } from 'astro';
import { buildLlms, llmsResponse } from '../data/llms';

/** /llms-full.txt: come llms.txt, più casi studio completi e tutte le domande frequenti. */
export const GET: APIRoute = ({ site }) => llmsResponse(buildLlms(site!.toString().replace(/\/$/, ''), true));
