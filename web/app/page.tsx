import { MemberDirectory } from "@/components/MemberDirectory";
import { listPublishedMembers } from "@/lib/members";
import { getSiteBanner } from "@/lib/site-banner";

export const revalidate = 60;

export default async function HomePage() {
  const [members, banner] = await Promise.all([listPublishedMembers(), getSiteBanner()]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="BNI Anchor">
            <img className="brand-logo" src="/images/brand/bni-logo.png" alt="BNI" width={200} height={77} />
            <span className="brand-word">ANCHOR</span>
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <p className="hero-kicker">BNI Anchor 香港分會</p>
            <h1 className="hero-title">
              Stronger. Bigger. We are <span>Anchor</span>.
            </h1>
            <p className="hero-lead">
              一站式瀏覽 BNI Anchor 專業會員：姓名、行業、公司與業務介紹。可用關鍵字搜尋，亦可以業務類別篩選。每週四聚會，Givers Gain®。
            </p>
            <div className="stats">
              <div className="stat">
                <b>{members.length}</b> 位會員
              </div>
              <div className="stat">
                <b>9</b> 個業務類別
              </div>
              <div className="stat">
                <b>星期四</b> 分會
              </div>
            </div>
          </div>
        </section>

        <section className="banner" aria-label="BNI Anchor chapter leadership photo">
          <img src={banner.imageUrl} alt={banner.alt} width={1024} height={576} />
        </section>

        <MemberDirectory members={members} />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>BNI Anchor 分會會員名錄 · Next.js + MongoDB Atlas</p>
          <p>
            <a href="https://www.bni-anchor.com/">bni-anchor.com</a>
          </p>
        </div>
      </footer>
    </>
  );
}
