import { redirect } from 'next/navigation';

// The proxy (proxy.js) handles locale detection and redirect for all requests.
// This page is a fallback for edge cases where the proxy does not intercept.
export default function RootPage() {
    redirect('/el');
}
