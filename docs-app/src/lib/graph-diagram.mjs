// The site's one piece of bespoke imagery: a small SVG diagram of TinyDI's
// actual resolution flow (Token -> Container -> Factory -> Instance), reused
// between the homepage hero (decorative, unlabeled) and the Architecture
// section (labeled). A code-driven diagram is a more honest visual for this
// library than a stock photo — see DESIGN.md "Signature visual motif".

const NODES = [
  { x: 40, y: 130, w: 108, h: 60, key: 'token', title: 'Token' },
  { x: 216, y: 100, w: 150, h: 120, key: 'container', title: 'Container' },
  { x: 434, y: 130, w: 108, h: 60, key: 'factory', title: 'Factory' },
  { x: 610, y: 130, w: 118, h: 60, key: 'instance', title: 'Instance' },
];

const CAPTIONS = {
  en: {
    token: 'A symbol-backed identifier carrying the service type',
    container: 'Looks up the registration, tracks the resolution path',
    factory: 'Builds the instance, resolving its own deps from the container',
    instance: 'Cached if Singleton, fresh every time if Transient',
    call: 'resolve(token)',
    loop: 'cached on Singleton',
  },
  it: {
    token: 'Un identificatore basato su symbol che porta il tipo del servizio',
    container: 'Cerca la registrazione, traccia il percorso di risoluzione',
    factory: 'Costruisce l’istanza, risolvendo le proprie dipendenze dal container',
    instance: 'Cache se Singleton, nuova ogni volta se Transient',
    call: 'resolve(token)',
    loop: 'in cache se Singleton',
  },
};

function node(n, index, labeled) {
  const rx = 10;
  const cls = n.key === 'container' ? 'graph-node-bg graph-node-bg--accent' : 'graph-node-bg';
  const label = `<text x="${n.x + n.w / 2}" y="${n.y + n.h / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" data-reveal style="--reveal-index:${index}">${n.title}</text>`;
  return `
    <rect class="${cls}" data-reveal style="--reveal-index:${index}" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${rx}" stroke-width="1.5"/>
    ${label}`;
}

// Sampled arc length of a cubic bezier, used to size stroke-dasharray/
// stroke-dashoffset for the "draw the line in" reveal animation. A value
// smaller than the real path length makes stroke-dasharray repeat (dash,
// gap, dash, gap...) along the curve, which after the animation settles
// leaves the line visibly broken instead of solid.
function cubicBezierLength(p0, p1, p2, p3, samples = 40) {
  const point = (t) => {
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
    const y =
      mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
    return [x, y];
  };
  let length = 0;
  let prev = point(0);
  for (let i = 1; i <= samples; i += 1) {
    const cur = point(i / samples);
    length += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    prev = cur;
  }
  return length;
}

function edge(fromNode, toNode, index, label) {
  const x1 = fromNode.x + fromNode.w;
  const y1 = fromNode.y + fromNode.h / 2;
  const x2 = toNode.x;
  const y2 = toNode.y + toNode.h / 2;
  const midX = (x1 + x2) / 2;
  const length = Math.hypot(x2 - x1, y2 - y1) + 20;
  // Labels sit clear above both nodes' tops, never centered in the (often
  // narrow) gap between them — a centered label wider than the gap would
  // otherwise overlap the node itself.
  const labelY = Math.min(fromNode.y, toNode.y) - 12;
  const labelMarkup = label
    ? `<text x="${midX}" y="${labelY}" text-anchor="middle" class="graph-label-muted" data-reveal style="--reveal-index:${index}">${label}</text>`
    : '';
  return `
    <path class="graph-edge" data-reveal style="--reveal-index:${index};--edge-length:${length}" d="M${x1},${y1} L${x2},${y2}" marker-end="url(#graph-arrow)"/>
    ${labelMarkup}`;
}

/**
 * @param {{labeled?: boolean, lang?: 'en'|'it'}} options
 */
export function resolutionGraphSvg({ labeled = false, lang = 'en' } = {}) {
  const [token, container, factory, instance] = NODES;
  const captions = CAPTIONS[lang];

  const captionsMarkup = labeled
    ? `
    <g font-size="11.5" class="graph-label-muted">
      <foreignObject x="${token.x - 20}" y="${token.y + token.h + 14}" width="${token.w + 40}" height="70"><body xmlns="http://www.w3.org/1999/xhtml" style="font-family:var(--font-body);color:var(--ink-muted);font-size:12px;line-height:1.4;margin:0;">${captions.token}</body></foreignObject>
      <foreignObject x="${container.x - 15}" y="${container.y + container.h + 14}" width="${container.w + 30}" height="70"><body xmlns="http://www.w3.org/1999/xhtml" style="font-family:var(--font-body);color:var(--ink-muted);font-size:12px;line-height:1.4;margin:0;">${captions.container}</body></foreignObject>
      <foreignObject x="${factory.x - 20}" y="${factory.y + factory.h + 14}" width="${factory.w + 40}" height="70"><body xmlns="http://www.w3.org/1999/xhtml" style="font-family:var(--font-body);color:var(--ink-muted);font-size:12px;line-height:1.4;margin:0;">${captions.factory}</body></foreignObject>
      <foreignObject x="${instance.x - 20}" y="${instance.y + instance.h + 14}" width="${instance.w + 40}" height="70"><body xmlns="http://www.w3.org/1999/xhtml" style="font-family:var(--font-body);color:var(--ink-muted);font-size:12px;line-height:1.4;margin:0;">${captions.instance}</body></foreignObject>
    </g>`
    : '';

  const viewBoxHeight = labeled ? 260 : 220;

  return `
  <svg class="graph-diagram" viewBox="0 0 760 ${viewBoxHeight}" role="img" aria-label="${labeled ? 'Diagram: Token flows into Container, which calls the Factory to build an Instance' : ''}" ${labeled ? '' : 'aria-hidden="true"'}>
    <defs>
      <marker id="graph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-muted)"/>
      </marker>
    </defs>
    ${edge(token, container, 1, labeled ? captions.call : '')}
    ${node(token, 0, labeled)}
    ${node(container, 1, labeled)}
    ${edge(container, factory, 2)}
    ${node(factory, 2, labeled)}
    ${edge(factory, instance, 3)}
    ${node(instance, 3, labeled)}
    ${(() => {
      const accentP0 = [instance.x + instance.w / 2, instance.y];
      const accentP1 = [instance.x + instance.w / 2, container.y - 40];
      const accentP2 = [container.x + container.w / 2, container.y - 40];
      const accentP3 = [container.x + container.w / 2, container.y];
      const accentLength = cubicBezierLength(accentP0, accentP1, accentP2, accentP3) + 20;
      return `<path class="graph-edge graph-edge--accent" data-reveal style="--reveal-index:4;--edge-length:${accentLength}" d="M${accentP0[0]},${accentP0[1]} C ${accentP1[0]},${accentP1[1]} ${accentP2[0]},${accentP2[1]} ${accentP3[0]},${accentP3[1]}" marker-end="url(#graph-arrow)"/>`;
    })()}
    ${labeled ? `<text x="${(instance.x + container.x) / 2 + 40}" y="${container.y - 48}" text-anchor="middle" class="graph-label-muted" data-reveal style="--reveal-index:4">${captions.loop}</text>` : ''}
    ${captionsMarkup}
  </svg>`;
}
