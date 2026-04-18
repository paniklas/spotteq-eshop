import "@/app/globals.css";
import Link from 'next/link';
import { Button } from "@/components/ui/button";


export const dynamic = 'force-static'

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center leading-loose gap-3 font-ceraproregular">
      <h2 className="text-xl">404 - Not Found</h2>
      <p className="text-xl">The page you are looking cannot be found.</p>
      <Link href="/">
        <Button>Go Back</Button>
      </Link>
    </section>
  )
}