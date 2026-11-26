import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-border bg-muted text-primary">
        <SearchX className="size-6" aria-hidden="true" />
      </div>
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
        404 · Halaman Tidak Ditemukan
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
        Produk atau Halaman Tidak Tersedia
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Aksesoris yang Anda cari mungkin telah dipindahkan atau sudah tidak
        diproduksi. Silakan lihat katalog aktif CR7 Racing untuk pilihan lampu
        LED dan part CNC lainnya.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Kembali ke Katalog</span>
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
