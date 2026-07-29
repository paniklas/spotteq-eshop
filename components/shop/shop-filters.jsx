"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/navigation"

const FilterNav = ({ 
    sortedGroups,
    bundles,
    activeSlug,
    activeBundleSlug,
    activeBundlesPage,
    onNavigate,
    tabIndex = 0 }) => (
    <>
        <div className="flex flex-col gap-2">
            <Link
                href="/shop/shop-all"
                onClick={onNavigate}
                tabIndex={tabIndex}
                className={`font-aeonik text-[14px] xl:text-[15px] transition-colors duration-300 ${
                    !activeSlug && !activeBundleSlug && !activeBundlesPage ? "text-orange-accent font-semibold" : "text-black-custom hover:text-panBlack"
                }`}
            >
                All Products
            </Link>
            <Link
                href="/shop/bundles"
                onClick={onNavigate}
                tabIndex={tabIndex}
                className={`font-aeonik text-[14px] xl:text-[15px] transition-colors duration-300 ${
                    activeBundlesPage ? "text-orange-accent font-semibold" : "text-black-custom hover:text-panBlack"
                }`}
            >
                All Bundles
            </Link>
        </div>

        {sortedGroups.map(([groupSlug, group]) => (
            <div key={groupSlug} className="mt-8">
                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                    SHOP BY {group.title}
                </p>
                <ul className="mt-4 flex flex-col">
                    {group.items.map((cat) => (
                        <li key={cat._id}>
                            <Link
                                href={`/shop/category/${cat.slug}`}
                                onClick={onNavigate}
                                tabIndex={tabIndex}
                                className={`font-aeonik text-[14px] xl:text-[15px] transition-colors duration-300 ${
                                    activeSlug === cat.slug
                                        ? "text-orange-accent font-semibold"
                                        : "text-black-custom hover:text-panBlack"
                                }`}
                            >
                                {cat.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ))}

        {bundles.length > 0 && (
            <div className="mt-8">
                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                    SHOP BY BUNDLE
                </p>
                <ul className="mt-4 flex flex-col">
                    {bundles.filter(b => b.title && b.slug).map((bundle) => (
                        <li key={bundle._id}>
                            <Link
                                href={`/shop/bundle/${bundle.slug}`}
                                onClick={onNavigate}
                                tabIndex={tabIndex}
                                className={`font-aeonik text-[14px] xl:text-[15px] transition-colors duration-300 ${
                                    activeBundleSlug === bundle.slug
                                        ? "text-orange-accent font-semibold"
                                        : "text-black-custom hover:text-panBlack"
                                }`}
                            >
                                {bundle.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </>
)

const ShopFilters = ({ total, sortedGroups = [], bundles = [], activeSlug, activeBundleSlug, activeBundlesPage = false }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") setOpen(false) }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    return (
        <>
            {/* ── Desktop sidebar (md and up) ── */}
            <div className="hidden md:block">
                {total != null && (
                    <p className="mb-12 font-aeonik text-[14px] xl:text-[18px] uppercase text-black-custom border-b-2 border-black-custom">
                        {total} Results
                    </p>
                )}
                <div className="mt-8">
                    <FilterNav
                        sortedGroups={sortedGroups}
                        bundles={bundles}
                        activeSlug={activeSlug}
                        activeBundleSlug={activeBundleSlug}
                        activeBundlesPage={activeBundlesPage}
                    />
                </div>
            </div>

            {/* ── Mobile Filters / Results bar (below md) ── */}
            <div className="md:hidden flex items-center justify-between mt-8">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="font-aeonik text-[14px] uppercase text-black-custom border-b border-black-custom cursor-pointer"
                >
                    Filters
                </button>
                {total != null && (
                    <span className="font-aeonik text-[14px] uppercase text-black-custom border-b border-black-custom">
                        {total} Results
                    </span>
                )}
            </div>

            {/* ── Mobile filter drawer ── */}
            <div className="md:hidden">
                {/* Backdrop — starts below the fixed header */}
                <div
                    aria-hidden="true"
                    onClick={() => setOpen(false)}
                    className={`fixed inset-x-0 top-24 bottom-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                />

                {/* Panel — anchored under the header, scrollable within its own height */}
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Shop filters"
                    aria-hidden={!open}
                    data-lenis-prevent
                    className={`fixed top-24 bottom-0 left-0 z-40 w-[60%] max-w-sm bg-white-custom overflow-y-auto overscroll-contain transition-transform duration-500 ease-in-out ${
                        open ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="page-x pt-8 pb-16">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            tabIndex={open ? 0 : -1}
                            className="font-aeonik text-[13px] uppercase text-black-custom mb-10 cursor-pointer hover:opacity-60 transition-opacity"
                        >
                            Close
                        </button>

                        <FilterNav
                            sortedGroups={sortedGroups}
                            bundles={bundles}
                            activeSlug={activeSlug}
                            activeBundleSlug={activeBundleSlug}
                            activeBundlesPage={activeBundlesPage}
                            onNavigate={() => setOpen(false)}
                            tabIndex={open ? 0 : -1}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopFilters
