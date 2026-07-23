import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

export async function register() {
  // DNS fix applied before any connections
}
