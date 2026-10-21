export default function Placeholder({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">{text}</p>
      <div className="card">Dieser Bereich folgt in einem der nächsten Schritte.</div>
    </section>
  );
}
