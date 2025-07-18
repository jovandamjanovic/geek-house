import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/gh_large.png"
          alt="Geek House logo"
          width={180}
          height={180}
          priority
        />
        <h1>Welcome to Geek House!</h1>
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

      </main>
    </div>
  );
}
