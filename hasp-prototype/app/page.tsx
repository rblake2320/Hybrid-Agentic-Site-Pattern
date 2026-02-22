export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: \"0 auto\" }}>
      <h1>HASP Prototype</h1>
      <p>
        Same URL serves human HTML, agent Markdown, and agent HASP JSON based on <code>Accept</code>.
      </p>
      <ul>
        <li><a href=\"/hasp-demo\">UI demo</a></li>
        <li><a href=\"/products/quantum-x1\">/products/quantum-x1</a></li>
        <li><a href=\"/docs/getting-started\">/docs/getting-started</a></li>
        <li><a href=\"/support/tickets\">/support/tickets</a></li>
        <li><a href=\"/.well-known/agent-manifest.json\">/.well-known/agent-manifest.json</a></li>
        <li><a href=\"/.well-known/ai-policy.txt\">/.well-known/ai-policy.txt</a></li>
      </ul>
      <p style={{ opacity: 0.8 }}>
        Tip: use curl with <code>Accept: text/markdown</code> and <code>User-Agent: agent/...</code>.
      </p>
    </main>
  );
}
