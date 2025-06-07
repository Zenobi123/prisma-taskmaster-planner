
// Re-export all fiscal obligation services from their dedicated files
export { getClientsWithUnpaidIgs } from "./fiscal/unpaidIgsService";
export { getClientsWithUnpaidPatente } from "./fiscal/unpaidPatenteService";
export { getClientsWithUnfiledDsf } from "./fiscal/unfiledDsfService";
export { getClientsWithUnfiledDarp } from "./fiscal/unfiledDarpService";
export { shouldClientBeSubjectToObligation } from "./fiscal/defaultObligationRules";
