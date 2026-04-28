"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowLeft, Eye, Mail, MapPin, Phone, ShoppingCart, Star } from "lucide-react";
import Header from "../../components/Header";
import { useCart } from "../../components/cart/useCart";
import type { BrandProfileSummary, CatalogProduct } from "../../product-data";
import styles from "./marca.module.css";

type BrandProfileClientProps = {
  brand: BrandProfileSummary;
  products: CatalogProduct[];
};

export default function BrandProfileClient({ brand, products }: BrandProfileClientProps) {
  const { addItem } = useCart();

  return (
    <div className={styles.page}>
      <Header showSearch={false} />

      <div className={styles.wrapper}>
        <Link href="/producto" className={styles.backLink}>
          <ArrowLeft size={18} strokeWidth={2.2} />
          Volver al catalogo
        </Link>

        <section className={styles.heroCard}>
          <div className={styles.brandTop}>
            <div className={styles.avatarShell}>
              <img src={brand.logoUrl} alt={brand.name} className={styles.avatar} />
            </div>

            <div className={styles.brandIntro}>
              <p className={styles.eyebrow}>Perfil de marca</p>
              <h1 className={styles.title}>{brand.name}</h1>
              <p className={styles.description}>{brand.description}</p>

              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill={brand.rating >= index + 1 ? "#E6885C" : "transparent"}
                      color="#E6885C"
                      strokeWidth={1.8}
                    />
                  ))}
                </div>
                <span className={styles.ratingValue}>{brand.rating.toFixed(1)}</span>
                <span className={styles.ratingLabel}>Calificacion de la marca</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.infoLayout}>
          <article className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <h2>Informacion general de la empresa</h2>
              <span>Datos visibles del proveedor</span>
            </div>

            <div className={styles.infoList}>
              <div>
                <span><Mail size={16} strokeWidth={2} /> Correo</span>
                <strong>{brand.email}</strong>
              </div>
              <div>
                <span><Phone size={16} strokeWidth={2} /> Telefono</span>
                <strong>{brand.phone}</strong>
              </div>
              <div>
                <span><MapPin size={16} strokeWidth={2} /> Direccion</span>
                <strong>{brand.address}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Catalogo de la marca</p>
              <h2>Productos de {brand.name}</h2>
            </div>
            <span>{products.length} producto{products.length === 1 ? "" : "s"}</span>
          </div>

          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Esta marca aun no tiene productos activos</h3>
              <p>Cuando publique productos nuevos apareceran aqui dentro de Emotia Store.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article key={product.id} className={styles.productCard}>
                  <Link href={`/producto/${product.id}`} className={styles.productImageWrap}>
                    <span className={styles.productTag}>{product.tag}</span>
                    <img src={product.imageUrl || "/logo/logo-store.png"} alt={product.nombre} className={styles.productImage} />
                  </Link>

                  <div className={styles.productContent}>
                    <p className={styles.productCategory}>{product.categoria}</p>
                    <h3>{product.nombre}</h3>
                    <p className={styles.productMeta}>{product.ocasion}</p>
                    <div className={styles.productRating}>
                      <Star size={15} fill="#E6885C" color="#E6885C" strokeWidth={1.8} />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    <p className={styles.productPrice}>Bs. {product.precio.toFixed(2)}</p>

                    <div className={styles.actions}>
                      <Link href={`/producto/${product.id}`} className={styles.viewButton}>
                        <Eye size={16} strokeWidth={2} />
                        Ver producto
                      </Link>

                      <button
                        type="button"
                        className={styles.cartButton}
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.nombre,
                            brand: product.marca,
                            price: product.precio,
                            imageUrl: product.imageUrl,
                            subtitle: `${product.categoria} / ${product.ocasion}`,
                          })
                        }
                      >
                        <ShoppingCart size={16} strokeWidth={2} />
                        Añadir a la bolsa
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
