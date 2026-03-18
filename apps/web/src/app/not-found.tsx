import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
			<div className="absolute inset-0">
				<div className="from-primary/12 via-secondary/60 to-background absolute inset-0 bg-gradient-to-br" />
				<div className="bg-primary/10 absolute top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" />
				<div className="bg-secondary absolute right-0 bottom-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full blur-3xl" />
			</div>

			<section className="border-border/70 bg-background/85 relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border shadow-[0_30px_120px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-6 px-8 py-10 sm:px-10 lg:px-14 lg:py-14">
					<div className="bg-secondary text-secondary-foreground w-fit rounded-full border border-secondary-border px-4 py-1 text-sm font-medium">
						Error 404
					</div>

					<div className="space-y-4">
						<h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							This page took a wrong turn.
						</h1>
						<p className="text-muted-foreground max-w-xl text-base leading-7 sm:text-lg">
							The page you were looking for does not exist, may have moved, or
							the link was typed incorrectly. Head back home and continue
							editing without the detour.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" className="min-w-40">
							<Link href="/">
								<Home className="size-4" />
								Home
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="min-w-40 bg-transparent"
						>
							<Link href="/">
								<ArrowLeft className="size-4" />
								Back to editor
							</Link>
						</Button>
					</div>
				</div>

				<div className="from-secondary/30 to-background relative flex flex-1 items-center justify-center bg-gradient-to-br p-6 sm:p-8 lg:p-10">
					<div className="border-border/60 bg-background/90 relative w-full max-w-md overflow-hidden rounded-[1.75rem] border p-3 shadow-2xl">
						<div className="bg-accent/80 absolute inset-x-0 top-0 h-12" />
						<div className="relative flex items-center justify-center overflow-hidden rounded-[1.2rem] px-6 py-10 sm:px-8">
							<Image
								src="/404_page.gif"
								alt="Animated 404 illustration"
								width={150}
								height={133}
								priority
								unoptimized
								className="h-auto w-full max-w-[220px] object-contain"
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
