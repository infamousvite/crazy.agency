import type { APIRoute } from 'astro';
import { buildLlms, llmsResponse } from '../data/llms';

/** /llms.txt: i fatti essenziali su Crazy. per gli assistenti AI (si genera dai dati del sito). */
export const GET: APIRoute = ({ site }) => llmsResponse(buildLlms(site!.toString().replace(/\/$/, ''), false));
