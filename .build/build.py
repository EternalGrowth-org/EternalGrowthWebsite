"""Writes the five pages (index, subjects, impact, about, team) from content.py.
Run from the repo root: python .build/build.py"""
import re, json, sys, html, math

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
import os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content.py'), encoding='utf-8').read())

def svg(body, vb='0 0 24 24', sw='1.6'):
    return f'<svg viewBox="{vb}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>'

ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>')
LEFT = svg('<path d="M19 12H5M11 6l-6 6 6 6"/>')
CHEV = svg('<path d="m6 9 6 6 6-6"/>')
UP = svg('<path d="M12 19V5M6 11l6-6 6 6"/>')
BRAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0b0b0b"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#f2f2ef" stroke-width="1.2"/><circle cx="12" cy="12" r="2.2" fill="#f2f2ef"/></svg>'

def btn(label, href, cls='btn', extra=''):
    return f'<a class="{cls}" href="{href}"{extra}><span class="roll"><span>{label}</span><span aria-hidden="true">{label}</span></span>{ARROW}</a>'
def button(label, cls='btn', typ='submit'):
    return f'<button class="{cls}" type="{typ}"><span class="roll"><span>{label}</span><span aria-hidden="true">{label}</span></span>{ARROW}</button>'

ART = {
    'math': '<path d="M30 170h150M30 170V20"/><path d="M30 140 180 30"/><path d="M60 170l55-95 55 95z"/><circle cx="115" cy="122" r="26"/>',
    'english': '<path d="M100 50v120M100 50c-20-10-48-12-70-6v120c22-6 50-4 70 6M100 50c20-10 48-12 70-6v120c-22-6-50-4-70 6"/><path d="M44 80h40M44 100h40M44 120h28M116 80h40M116 100h40M116 120h28"/>',
    'science': '<path d="M100 40l52 30v60l-52 30-52-30V70z"/><circle cx="100" cy="100" r="22"/><path d="M100 40V16M152 70l20-12M48 130l-20 12"/>',
    'coding': '<path d="M70 60 30 100l40 40M130 60l40 40-40 40M112 46 88 154"/>',
    'music': '<path d="M20 64h160M20 84h160M20 104h160M20 124h160M20 144h160"/><path d="M70 134V54M120 114V34M160 144V64"/><circle cx="60" cy="134" r="10"/><circle cx="110" cy="114" r="10"/><circle cx="150" cy="144" r="10"/>',
    'social-studies': '<circle cx="100" cy="100" r="72"/><ellipse cx="100" cy="100" rx="30" ry="72"/><path d="M28 100h144M40 64h120M40 136h120"/>',
    'beyond': '<rect x="40" y="40" width="120" height="120" rx="6"/><path d="M70 40v120M100 40v120M130 40v120M40 70h120M40 100h120M40 130h120"/>',
}
def art(sid, sw='1.4', draw=True):
    return f'<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"{" data-draw" if draw else ""}>{ART[sid]}</svg>'
SUBJ_ICON = {'math': 'math', 'english': 'book', 'science': 'flask', 'coding': 'code', 'music': 'note', 'social-studies': 'globe', 'beyond': 'spark'}
def chip_art(sid):
    return ico(SUBJ_ICON[sid])

I = {  # small UI icons, 24 grid
    'ahead': '<path d="M3 20h5v-5h5v-5h5V5"/><path d="M15 5h3v3"/>',
    'run': '<rect x="3" y="3" width="11" height="11" rx="2"/><rect x="10" y="10" width="11" height="11" rx="2"/>',
    'given': '<path d="M12 20s-7-4.3-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.7 12 20 12 20z"/>',
    'coin': '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h3.5a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3H14"/>',
    'wave': '<path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    'book': '<path d="M12 6c-2-1.3-5-1.6-8-1v13c3-.6 6-.3 8 1 2-1.3 5-1.6 8-1V5c-3-.6-6-.3-8 1zM12 6v13"/>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7"/>',
    'chat': '<path d="M4 5h16v11H9l-5 4z"/>',
    'match': '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c.8-2.6 2.8-4 5-4s4.2 1.4 5 4M11 19c.8-2.6 2.8-4 5-4s4.2 1.4 5 4"/>',
    'plan': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    'grow': '<path d="M12 20V10M12 10c0-3 2-5 6-5 0 4-2 6-6 6zM12 13c0-2.5-1.7-4.5-5-4.5 0 3.3 1.7 5 5 5"/>',
    'one': '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    'group': '<circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M2.5 19.5c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7M14 15.2c.8-.3 1.6-.4 2.5-.4 2.3 0 4.2 1.4 4.8 4.2"/>',
    'online': '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
    'seed': '<circle cx="12" cy="14" r="5"/><path d="M12 9V4"/>',
    'school': '<path d="M3 10 12 5l9 5-9 5z"/><path d="M7 12.5V17c3 2 7 2 10 0v-4.5"/>',
    'cap': '<path d="M2 9 12 4l10 5-10 5z"/><path d="M6 11v5c4 2.5 8 2.5 12 0v-5M22 9v6"/>',
    'teach': '<path d="M4 19V6h16v13M4 19h16M8 10h8M8 14h5"/>',
    'math': '<path d="M18 6H6l6 6-6 6h12"/>',
    'flask': '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 14h9"/>',
    'code': '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    'note': '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.5 3.5 3.5 14.5 0 18M12 3c-3.5 3.5-3.5 14.5 0 18"/>',
    'spark': '<path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>',
    'open': '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
    'stick': '<path d="M5 19 12 5l7 14M8 14h8"/>',
}
def ico(k):
    return svg(I[k])

def monos(ids):
    return '<span class="monos">' + ''.join(f'<span aria-hidden="true">{initials(PEOPLE[p])}</span>' for p in ids) + '</span>'
def role_of(pid, role):
    return ' · '.join([role] + EXTRA_ROLES.get(pid, []))

# headshots: images/<id>_bio.<ext>; people without one keep their monogram
PHOTOS = {f.split('_bio.')[0]: 'images/' + f for f in sorted(os.listdir(os.path.join(ROOT, 'images'))) if '_bio.' in f}

def photo(pid, cls='plate__photo', eager=False):
    return f'<span class="{cls}"><img src="{PHOTOS[pid]}" alt="{PEOPLE[pid]}" width="600" height="600" loading="{"eager" if eager else "lazy"}" decoding="async"></span>'

def team_face(pid):
    if pid in PHOTOS:
        return f'<b class="alum__photo" aria-hidden="true"><img src="{PHOTOS[pid]}" alt="" width="76" height="76" loading="lazy" decoding="async"></b>'
    return f'<b aria-hidden="true">{initials(PEOPLE[pid])}</b>'

def plate(pid):
    if pid in PHOTOS:
        return f'<div class="plate__face plate__face--photo">{photo(pid)}<span class="plate__shine"></span></div>'
    return f'<div class="plate__face"><span class="plate__mono" aria-hidden="true">{initials(PEOPLE[pid])}</span><span class="plate__shine"></span></div>'

def thorns_svg():
    """A ring of two interwoven vines with short straight thorns: an original drawing."""
    C, R = 500, 380
    def strand(phase):
        pts = []
        for a in range(0, 721):
            t = math.radians(a / 2)
            r = R + 20 * math.sin(14 * t + phase)
            pts.append(f'{C + r * math.cos(t):.1f},{C + r * math.sin(t):.1f}')
        return 'M' + ' L'.join(pts)
    thorns = []
    for i in range(64):
        t = 2 * math.pi * i / 64 + 0.05
        ph = 0 if i % 2 else math.pi
        r = R + 20 * math.sin(14 * t + ph)
        x, y = C + r * math.cos(t), C + r * math.sin(t)
        out = 1 if i % 4 < 2 else -1
        L = 18 + (i * 7 % 11)
        tilt = t + 0.35 * out
        x2, y2 = x + out * L * math.cos(tilt), y + out * L * math.sin(tilt)
        thorns.append(f'M{x:.1f} {y:.1f}L{x2:.1f} {y2:.1f}')
    return (f'<svg class="hero__thorns" viewBox="0 0 1000 1000" aria-hidden="true" data-depth="0.03">'
            f'<path d="{strand(0)}"/><path d="{strand(math.pi)}"/><path d="{"".join(thorns)}"/></svg>')

# ---------------------------------------------------------------- shell
GS = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/'
NAV_LINKS = [('subjects', 'Subjects'), ('impact', 'Impact'), ('about', 'About'), ('team', 'Team')]
SITE = 'https://eternalgrowth.org/'
ORG_LD = {
    '@context': 'https://schema.org', '@type': ['EducationalOrganization', 'NGO'], '@id': SITE + '#org',
    'name': 'Eternal Growth', 'legalName': 'Eternal Growth, Inc.', 'url': SITE, 'logo': {'@type': 'ImageObject', 'url': SITE + 'icon-512.png', 'width': 512, 'height': 512}, 'image': SITE + 'og-image.png',
    'email': 'info@eternalgrowth.org',
    'description': 'A student-run nonprofit on Long Island, New York. High school students tutor younger kids in math, English, science, coding, music and more.',
    'areaServed': [{'@type': 'Place', 'name': 'Long Island, New York'}, {'@type': 'City', 'name': 'Syosset, NY'}, {'@type': 'City', 'name': 'Jericho, NY'}],
    'knowsAbout': ['Math tutoring', 'English tutoring', 'Science tutoring', 'Coding tutoring', 'Music lessons', 'Social studies tutoring', 'SAT prep', 'AMC math competition', 'USACO'],
    'contactPoint': {'@type': 'ContactPoint', 'contactType': 'customer support', 'email': 'info@eternalgrowth.org', 'areaServed': 'US-NY', 'availableLanguage': 'English'},
    'address': {'@type': 'PostalAddress', 'addressRegion': 'NY', 'addressCountry': 'US'},
}
SUBJECTS_LD = {'@context': 'https://schema.org', '@type': 'ItemList', 'name': 'Tutoring subjects', 'itemListElement': [
    {'@type': 'ListItem', 'position': i + 1, 'item': {'@type': 'Service', 'name': f'{x[1]} tutoring', 'serviceType': 'Tutoring', 'description': x[3],
     'provider': {'@id': SITE + '#org'}, 'areaServed': 'Long Island, New York', 'audience': {'@type': 'EducationalAudience', 'educationalRole': 'student'},
     'url': SITE + 'subjects#' + x[0]}} for i, x in enumerate(SUBJECTS)]}
TEAM_LD = {'@context': 'https://schema.org', '@type': 'ItemList', 'name': 'Eternal Growth officers and founders', 'itemListElement': [
    {'@type': 'ListItem', 'position': i + 1, 'item': {'@type': 'Person', 'name': PEOPLE[pid], 'jobTitle': role_of(pid, role).replace(' · ', ', '), 'memberOf': {'@id': SITE + '#org'}}}
    for i, (pid, role, *_) in enumerate(list(OFFICERS) + list(FOUNDERS))]}
def ld(obj):
    return '\n  <script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False).replace('</', '<\\/') + '</script>'
def crumbs(name, path):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE},
        {'@type': 'ListItem', 'position': 2, 'name': name, 'item': SITE + path}]}
WORDS = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen'.split()
COUNT = WORDS[len(OFFICERS)] if len(OFFICERS) < len(WORDS) else str(len(OFFICERS))
def head(title, desc, path='', extra=(), kind='WebPage', index=True):
    url = SITE + path
    page_ld = {'@context': 'https://schema.org', '@type': kind, '@id': url + '#page', 'url': url, 'name': title, 'description': desc, 'inLanguage': 'en-US',
               'isPartOf': {'@type': 'WebSite', '@id': SITE + '#site', 'name': 'Eternal Growth', 'url': SITE}, 'about': {'@id': SITE + '#org'},
               'primaryImageOfPage': SITE + 'og-image.png'}
    extra = list(extra) + ([page_ld] if index else [])
    t, d = html.escape(title), html.escape(desc)
    seo = f'''
  <link rel="canonical" href="{url}">
  <meta name="robots" content="{"index, follow, max-image-preview:large" if index else "noindex"}">
  <meta name="author" content="Eternal Growth">
  <meta name="geo.region" content="US-NY">
  <meta name="geo.placename" content="Long Island, New York">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Eternal Growth">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="{t}">
  <meta property="og:description" content="{d}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Eternal Growth: student-run tutoring on Long Island">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{t}">
  <meta name="twitter:description" content="{d}">
  <meta name="twitter:image" content="{SITE}og-image.png">
  <meta name="twitter:image:alt" content="Eternal Growth: student-run tutoring on Long Island">''' + ''.join(ld(x) for x in extra)
    plugins = ''.join(f'\n  <script src="{GS}{p}.min.js" defer></script>' for p in ['gsap', 'ScrollTrigger', 'ScrollSmoother', 'SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'ScrambleTextPlugin'])
    links = ''.join(f'<li><a href="{h}">{n}</a></li>' for h, n in NAV_LINKS)
    return f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{t}</title>
  <meta name="description" content="{d}">{seo}
  <meta name="theme-color" content="#f2f2ef">
  <script>
    (function () {{
      var d = document.documentElement; d.classList.remove('no-js'); d.classList.add('js');
      try {{ if (sessionStorage.getItem('eg-arrive')) {{ sessionStorage.removeItem('eg-arrive'); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('is-arriving'); }} }} catch (e) {{}}
    }})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="favicon.ico" sizes="32x32">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">{plugins}
  <script src="vendor/three.r134.min.js" defer></script>
  <script src="vendor/vanta.fog.min.js" defer></script>
  <script src="script.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="liquid" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="n"/><feGaussianBlur in="n" stdDeviation="2" result="b"/><feDisplacementMap in="SourceGraphic" in2="b" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
  <div class="atmos" aria-hidden="true"><span class="atmos__orb"></span><span class="atmos__orb"></span><span class="atmos__orb"></span></div>
  <div class="shutter" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <div class="progress" aria-hidden="true"><span class="progress__num">01</span><span class="progress__bar"><i></i></span><span class="progress__name">Home</span></div>
  <div class="cursor" aria-hidden="true"><span></span></div>
  <header class="nav">
    <span class="nav__glass" aria-hidden="true"></span>
    <nav aria-label="Main">
      <ul class="nav__links" id="nav-links">{links}<li class="menu-cta">{btn('Request a tutor', './#request')}</li></ul>
    </nav>
    <a class="brand" href="./" aria-label="Eternal Growth, home">{BRAND}<span>Eternal Growth</span></a>
    <div class="nav__end">
      {btn('Request a tutor', './#request', 'btn btn--small')}
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span></button>
    </div>
  </header>
  <div id="smooth-wrapper"><div id="smooth-content">
'''

FOOT = f'''
  <footer class="footer">
    <div class="wrap">
      <div class="footer__cta">
        <div>
          <h2 class="head" data-anim="lines">Grow with us.</h2>
          <p class="lead">Tell us the subject and the grade. We will match a tutor who was in your student’s seat a few years ago.</p>
          {btn('Request a tutor', './#request', 'btn btn--light', ' data-cursor="Begin"')}
        </div>
      </div>
      <div class="footer__grid">
        <div class="footer__col"><p class="micro">Explore</p><ul><li><a href="subjects">Subjects</a></li><li><a href="impact">Impact</a></li><li><a href="about">About</a></li><li><a href="team">Team</a></li></ul></div>
        <div class="footer__col"><p class="micro">Contact</p><ul><li><a href="mailto:info@eternalgrowth.org">info@eternalgrowth.org</a></li><li><a href="tel:+13478786615">(347) 878-6615</a></li></ul></div>
        <div class="footer__col"><p class="micro">Long Island, NY</p><p class="footer__clock" data-clock aria-label="Local time on Long Island">--:--:--</p></div>
        <div class="footer__col"><p class="micro">Get involved</p><ul><li><a href="team#join">Tutor with us</a></li><li><a href="about#faq">Questions</a></li><li><a href="impact#giving">Where the money goes</a></li><li><a href="impact#projects">Projects</a></li></ul></div>
      </div>
      <div class="footer__base">
        <p class="small">© 2026 Eternal Growth, Inc. A student-run nonprofit on Long Island, New York. Site by Victor Pan, Webmaster. Background by <a href="https://www.vantajs.com">Vanta.js</a>.</p>
        <button class="to-top" type="button" data-top>Back to top {UP}</button>
      </div>
    </div>
  </footer>
  </div></div>
</body>
</html>
'''

def hero(title, lead, meta, extra='', cls='hero', orbit=False, chips=''):
    orb = ''
    if orbit:
        chips_html = ''.join(f'<span class="orb-chip" title="{s[1]}">{chip_art(s[0])}</span>' for s in SUBJECTS)
        orb = f'''<div class="hero__orbit" aria-hidden="true"><svg viewBox="0 0 1000 476" width="100%" height="100%"><path id="orbit-path" d="M500 30A470 208 0 1 1 499.9 30Z"/></svg>{chips_html}</div>'''
    return f'''
    <section class="{cls}" aria-labelledby="page-title">
      <div class="hero__inner">
        <p class="micro" data-anim="scramble">{meta}</p>
        <h1 class="display" id="page-title" data-anim="chars">{title}</h1>
        <p class="lead" data-anim="blur">{lead}</p>
        {extra}
        {chips}
      </div>
      <span class="scroll-hint" aria-hidden="true"></span>
    </section>'''

def ticker(items):
    inner = ''.join(f'<span class="ticker__item">{ico(k)}{t}</span>' for k, t in items)
    return f'<div class="ticker" aria-hidden="true"><div class="ticker__track">{inner}</div></div>'

def chapters(items, title):
    lis = ''.join(f'<li data-chapter data-shape="{s}" data-word="{w}" data-text="{html.escape(t)}"><b>{w}</b> {t}</li>' for s, w, t in items)
    dots = ''.join('<span></span>' for _ in items)
    return f'''
    <section class="chapters" data-chapters aria-labelledby="ch-title">
      <h2 class="visually-hidden" id="ch-title">{title}</h2>
      <div class="chapters__stage">
        <svg class="chapters__mark" viewBox="0 0 200 200" aria-hidden="true"><path d="M100 14A86 86 0 1 1 99.9 14Z"/></svg>
        <p class="chapter__word" aria-hidden="true">{items[0][1]}</p>
        <p class="chapters__text" aria-hidden="true">{items[0][2]}</p>
        <div class="chapters__dots" aria-hidden="true">{dots}</div>
      </div>
      <ul class="visually-hidden">{lis}</ul>
    </section>'''

FAQ = [
    ('Who are the tutors?', 'High school students, most from Syosset and Jericho, who know their subject and remember learning it.'),
    ('Which grades do you work with?', 'Elementary through high school. College students can ask too.'),
    ('Where do sessions happen?', 'In person around Long Island, or online over video.'),
    ('How is a tutor chosen?', 'By subject, grade and how your student learns. Tell us what has worked before.'),
    ('Where does the money go?', 'To causes across Long Island and beyond, including cancer research through Swim Across America, and to help subsidize tutoring.'),
    ('How do I become a tutor?', 'Email info@eternalgrowth.org with the subject you know best.'),
]
FAQ_LD = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
    {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub('<[^>]+>', '', ans)}} for q, ans in FAQ]}
def faq_list(items, prefix):
    return '<ul class="faq">' + ''.join(f'''<li data-rise><button type="button" aria-expanded="false" aria-controls="{prefix}-{i}" id="{prefix}-q-{i}">{q}<i aria-hidden="true"></i></button><div class="faq__a" id="{prefix}-{i}" role="region" aria-labelledby="{prefix}-q-{i}" hidden><p>{a}</p></div></li>''' for i, (q, a) in enumerate(items)) + '</ul>'

IMPACT_CHIPS = '<ul class="chips" data-rise><li><b data-count="35000" data-prefix="$" data-suffix="+">$35,000+</b> raised</li><li><b data-count="3500" data-prefix="$" data-suffix="+">$3,500+</b> to cancer research</li><li>Subsidized tutoring</li></ul>'

def card(icon_key, title, text, extra=''):
    return f'<div class="card" data-rise><span class="card__icon">{ico(icon_key)}</span><h3>{title}</h3><p>{text}</p>{extra}</div>'

# ---------------------------------------------------------------- home
slides = '\n'.join(f'''          <article class="slide" aria-label="{name}" data-cursor="Drag">
            <div class="slide__art" data-clip><span class="slide__num micro">{str(i + 1).zfill(2)}</span>{art(sid)}</div>
            <div class="slide__body">
              <h3>{name}</h3>
              <ul class="tags">{''.join(f'<li>{t}</li>' for t in topics[:3])}</ul>
              {f'<div class="slide__by">{monos(tutors[:4])}<span class="small">{", ".join(first(p) for p in tutors[:3])}{" +" if len(tutors) > 3 else ""}</span></div>' if tutors else ''}
              <a class="link-arrow" href="subjects#{sid}">Explore {ARROW}</a>
            </div>
          </article>''' for i, (sid, name, short, lead, detail, topics, tutors) in enumerate(SUBJECTS))

team_plates = ''.join(f'''<a class="plate" href="team#{pid}" data-rise data-cursor="View">{plate(pid)}<span class="plate__name">{PEOPLE[pid]}</span><span class="plate__role micro">{role_of(pid, role)}</span></a>''' for pid, role, _ in OFFICERS[:8])

HOME_CHAPTERS = [
    ('circle', 'Learn.', 'Every student starts with a question.'),
    ('book', 'Teach.', 'A tutor a few grades ahead explains it the way it clicked for them.'),
    ('star', 'Grow.', 'A plan for the term, steady sessions, confidence that compounds.'),
    ('heart', 'Give back.', 'What we raise goes back to causes that matter.'),
]

home = head('Eternal Growth | Student-run tutoring on Long Island, NY', 'Student-run tutoring nonprofit on Long Island. High school tutors from Syosset and Jericho teach math, English, science, coding and music, in person or online.', '', [ORG_LD, {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'Eternal Growth', 'url': SITE, 'publisher': {'@id': SITE + '#org'}}]) + f'''
  <main id="main">{hero('Eternal Growth', 'Tutoring by Long Island high schoolers, for the kids a few grades behind them.', 'Student-run nonprofit · Long Island, New York',
  f"""<form class="finder" id="finder" action="#request" data-rise>
          <label><span class="visually-hidden">Subject</span><select aria-label="Choose a subject"><option value="">What do you want to learn?</option>{OPTIONS}</select>{CHEV}</label>
          {button('Find a tutor')}
        </form>""", orbit=True, chips=IMPACT_CHIPS)}

    {ticker([('math', 'Mathematics'), ('book', 'English'), ('flask', 'Science'), ('code', 'Coding'), ('note', 'Music'), ('globe', 'Social studies'), ('cap', 'College planning'), ('given', 'Giving back')])}

    <section class="section section--screen" id="idea" aria-labelledby="idea-title">
      <div class="wrap manifesto">
        <h2 class="micro" id="idea-title" data-anim="scramble">The idea</h2>
        <p class="manifesto__text" data-anim="fill">Students teach the kids a few grades behind them, and give back what they raise.</p>
      </div>
      <div class="wrap cards" style="margin-top:clamp(48px,6vw,88px)">
        {card('ahead', 'Just ahead', 'Tutors still remember learning the same unit.')}
        {card('run', 'Run by students', 'Matching, outreach and the books, all handled by officers.')}
        {card('given', 'Given back', 'Funds go to cancer research and subsidized tutoring.')}
      </div>
    </section>

    <section class="band band--pin" aria-labelledby="impact-title" data-stackband>
      <div class="wrap band__grid">
        <div class="band__side">
          <p class="micro">Impact</p>
          <h2 class="head" id="impact-title" data-anim="lines">Started local. Built to grow.</h2>
          <p class="lead" data-anim="blur">What began on Long Island now runs like an organization: tutoring, fundraising and giving at scale.</p>
          <ol class="band__list" aria-hidden="true">
            <li class="is-on"><span>01</span>Raised so far</li>
            <li><span>02</span>Cancer research</li>
            <li><span>03</span>Subsidized tutoring</li>
            <li><span>04</span>Three-month drive</li>
          </ol>
          {btn('See our impact', 'impact', 'btn btn--light', ' data-cursor="Open"')}
        </div>
        <div class="stats" data-stack>
          <div class="stat">{svg(I['coin'], sw='1.5').replace('<svg', '<svg class="stat__icon"', 1)}<span class="stat__label micro">01 · Raised</span><span class="stat__num" data-count="35000" data-prefix="$" data-suffix="+">$35,000+</span><p>Raised by a club of high school students.</p></div>
          <div class="stat">{svg(I['wave'], sw='1.5').replace('<svg', '<svg class="stat__icon"', 1)}<span class="stat__label micro">02 · Given</span><span class="stat__num" data-count="3500" data-prefix="$" data-suffix="+">$3,500+</span><p>To Swim Across America for cancer research.</p></div>
          <div class="stat">{svg(I['book'], sw='1.5').replace('<svg', '<svg class="stat__icon"', 1)}<span class="stat__label micro">03 · Supported</span><span class="stat__num">Tutoring</span><p>Subsidized so more families can take part.</p></div>
          <div class="stat">{svg(I['wave'], sw='1.5').replace('<svg', '<svg class="stat__icon"', 1)}<span class="stat__label micro">04 · Project</span><span class="stat__num" data-count="10000" data-prefix="$">$10,000</span><p>Raised in three months by one student-led drive.</p></div>
        </div>
      </div>
    </section>

    {chapters(HOME_CHAPTERS, 'Learn, teach, grow, give back')}

    <section class="slider section" id="subjects" data-slider aria-labelledby="subjects-title">
      <div class="wrap shead">
        <h2 class="head" id="subjects-title" data-anim="lines">Seven subjects. One standard.</h2>
        <div class="slider__controls">
          <span class="slider__count" aria-live="polite">01 / 07</span>
          <button class="slider__btn" type="button" data-prev aria-label="Previous subject">{LEFT}</button>
          <button class="slider__btn" type="button" data-next aria-label="Next subject">{ARROW}</button>
        </div>
      </div>
      <div class="slider__viewport" tabindex="0" aria-label="Subjects, scroll sideways"><div class="slider__track">
{slides}
      </div></div>
      <div class="slider__progress" aria-hidden="true"><span></span></div>
    </section>

    <section class="section section--screen" id="stages" aria-labelledby="stages-title">
      <div class="wrap">
        <div class="shead shead--center"><h2 class="head" id="stages-title" data-anim="scale">For every stage.</h2></div>
        <div class="cards">
          {card('seed', 'Elementary', 'Number sense, reading, first science projects.')}
          {card('school', 'Middle school', 'Algebra, essays, first programs, lab reports.')}
          {card('cap', 'High school', 'Calculus, SAT and AMC, USACO, college planning.')}
        </div>
      </div>
    </section>

    <section class="section" id="how" aria-labelledby="how-title">
      <div class="wrap">
        <div class="shead"><h2 class="head" id="how-title" data-anim="chars">From request to progress.</h2><p class="lead" data-anim="blur">Four steps. The first takes a minute.</p></div>
        <div class="path">
          <svg class="path__svg" aria-hidden="true"></svg>
          <span class="path__dot" aria-hidden="true"></span>
          <ol class="steps">
            <li class="step" data-rise><span class="step__icon">{ico('chat')}</span><span class="step__num">STEP 1</span><h3>Tell us what you need</h3><p>Subject, grade, what is getting in the way.</p></li>
            <li class="step" data-rise><span class="step__icon">{ico('match')}</span><span class="step__num">STEP 2</span><h3>We match a tutor</h3><p>Someone who knows it and fits how your student learns.</p></li>
            <li class="step" data-rise><span class="step__icon">{ico('plan')}</span><span class="step__num">STEP 3</span><h3>Make a plan</h3><p>Goals for the term, paced with school.</p></li>
            <li class="step" data-rise><span class="step__icon">{ico('grow')}</span><span class="step__num">STEP 4</span><h3>Then it grows</h3><p>Steady sessions, steady progress.</p></li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section section--screen" id="ways" aria-labelledby="ways-title" style="padding-top:0">
      <div class="wrap">
        <div class="shead shead--center"><h2 class="head" id="ways-title" data-anim="flip">Three ways to learn.</h2></div>
        <div class="cards">
          {card('one', 'One-on-one', 'One tutor, one student, the whole session.')}
          {card('group', 'Small groups', 'A few students, the same unit, together.')}
          {card('online', 'Online', 'Video sessions from anywhere on Long Island.')}
        </div>
      </div>
    </section>

    <section class="section section--screen" id="people" aria-labelledby="people-title" style="padding-top:0">
      <div class="wrap">
        <div class="shead"><h2 class="head" id="people-title" data-anim="lines">The people behind it.</h2><a class="link-arrow" href="team" data-rise>Meet all {COUNT} officers {ARROW}</a></div>
        <div class="plates">{team_plates}</div>
      </div>
    </section>

    <section class="section" id="questions" aria-labelledby="questions-title">
      <div class="wrap faq-wrap">
        <div><h2 class="head" id="questions-title" data-anim="chars">Questions.</h2><a class="link-arrow" href="about#faq" data-rise>All questions {ARROW}</a></div>
        {faq_list(FAQ[:4], 'hq')}
      </div>
    </section>

    <section class="section" id="request" aria-labelledby="request-title">
      <div class="wrap request">
        <div class="request__side">
          <h2 class="head" id="request-title" data-anim="chars">Request a tutor.</h2>
          <p class="lead" data-anim="blur">Subject and grade. We match a tutor and write back.</p>
          <ul class="contact" data-rise>
            <li><span class="micro">Call or text</span><a href="tel:+13478786615">(347) 878-6615</a></li>
            <li><span class="micro">Email</span><a href="mailto:info@eternalgrowth.org">info@eternalgrowth.org</a></li>
            <li><span class="micro">Where</span><span>Long Island, in person or online</span></li>
          </ul>
        </div>
        <form class="form" id="request-form" action="https://formspree.io/f/xqagapza" method="POST" data-rise>
          <h3>Your request</h3>
          <div class="row2">
            <div class="field"><label for="parentName">Parent or guardian</label><input type="text" name="parentName" id="parentName" autocomplete="name" required></div>
            <div class="field"><label for="studentName">Student</label><input type="text" name="studentName" id="studentName" required></div>
          </div>
          <div class="field"><label for="email">Email</label><input type="email" name="email" id="email" autocomplete="email" required></div>
          <div class="row2">
            <div class="field"><label for="subject">Subject</label><select name="subject" id="subject" required><option value="">Choose a subject</option>{OPTIONS}<option value="multiple">More than one</option><option value="other">Something else</option></select></div>
            <div class="field"><label for="grade">Grade</label><select name="grade" id="grade" required><option value="">Choose a grade</option><option value="elementary">Elementary (K–5)</option><option value="middle">Middle school (6–8)</option><option value="high">High school (9–12)</option><option value="college">College</option></select></div>
          </div>
          <div class="match" aria-live="polite" hidden><span class="monos"></span><p></p></div>
          <div class="field"><label for="message">What should the tutor know?</label><textarea name="message" id="message" rows="4" placeholder="Goals, upcoming tests, what has or hasn’t worked"></textarea></div>
          {button('Send request')}
          <p class="status" role="status"></p>
        </form>
      </div>
    </section>
  </main>
''' + FOOT

# ---------------------------------------------------------------- impact page
IMPACT_CHAPTERS = [
    ('coin', 'Raise.', 'Students raise money through Eternal Growth.'),
    ('check', 'Choose.', 'The treasurers decide where it can do the most good.'),
    ('wave', 'Give.', 'More than $3,500 went to Swim Across America for cancer research.'),
    ('book', 'Teach.', 'More helps subsidize tutoring, so more families can take part.'),
]
impact_page = head('Our impact: $35,000+ raised | Eternal Growth', 'Eternal Growth has raised more than $35,000, given more than $3,500 to Swim Across America for cancer research, and subsidized tutoring on Long Island.', 'impact', [crumbs('Impact', 'impact')]) + f'''
  <main id="main">{hero('Impact', 'What a student-run nonprofit has raised, and where it went.', 'Raised by students · Given back', '', cls='hero page-hero', chips=IMPACT_CHIPS)}
    {ticker([('coin', 'Raised by students'), ('wave', 'Cancer research'), ('book', 'Subsidized tutoring'), ('given', 'Given back'), ('check', 'Chosen with care')])}

    <section class="section" id="giving" aria-labelledby="giving-title">
      <div class="wrap split">
        <div>
          <h2 class="head" id="giving-title" data-anim="lines">Thirty-five thousand, and counting.</h2>
          <p class="lead" data-anim="blur">Raised by high school students across Long Island. About one tenth went to cancer research.</p>
          <div data-rise>{btn('Request a tutor', './#request')}</div>
        </div>
        <div data-rise>
          <div class="ring-wrap" data-clip>
            <svg class="ring" viewBox="0 0 220 220" fill="none" aria-hidden="true"><circle class="ring__track" cx="110" cy="110" r="96"/><circle class="ring__all" cx="110" cy="110" r="96"/><circle class="ring__part" cx="110" cy="110" r="96"/></svg>
            <div class="ring-center"><span class="micro">Raised</span><span class="stat__num" style="font-size:clamp(2.4rem,1.4rem+3vw,4rem)" data-count="35000" data-prefix="$" data-suffix="+">$35,000+</span><span class="small">and counting</span></div>
          </div>
          <ul class="legend"><li><i style="background:#0b0b0b"></i>$3,500+ · Swim Across America</li><li><i style="background:#b4b4ae"></i>Everything else, including tutoring support</li></ul>
        </div>
      </div>
    </section>

    {chapters(IMPACT_CHAPTERS, 'How the money moves')}

    <section class="section section--screen" aria-labelledby="where-title">
      <div class="wrap">
        <div class="shead shead--center"><h2 class="head" id="where-title" data-anim="scale">Where it goes.</h2></div>
        <div class="cards">
          {card('wave', 'Swim Across America', 'More than $3,500 to a charity that funds cancer research through open-water swims.')}
          {card('book', 'Subsidized tutoring', 'Help with the cost of tutoring, so more families can take part.')}
          {card('check', 'Chosen with care', 'The treasurers, Mike Lu and Alan Chen, evaluate every cause.')}
        </div>
      </div>
    </section>

    <section class="section" id="projects" aria-labelledby="projects-title">
      <div class="wrap">
        <div class="shead"><h2 class="head" id="projects-title" data-anim="lines">Projects.</h2><p class="lead" data-anim="blur">Student-led drives that start local and reach further.</p></div>
        <article class="project" data-rise aria-labelledby="project-saa">
          <div class="project__main">
            <p class="micro">Project 01 · Fundraiser</p>
            <h3 class="project__title" id="project-saa">The Swim Across America drive</h3>
            <p class="project__text">Victor Pan led a three-month fundraising push with Katherine Fei and Sue Nian. Together they raised $10,000, and more than $3,500 of it went to Swim Across America to fund cancer research.</p>
            <ul class="project__team" aria-label="Project team">
              <li>{team_face('victor')}<span>Victor Pan<small>Project lead</small></span></li>
              <li>{team_face('katherine')}<span>Katherine Fei<small>Organizer</small></span></li>
              <li>{team_face('sue')}<span>Sue Nian<small>Organizer</small></span></li>
            </ul>
          </div>
          <div class="project__figs">
            <div class="project__big">
              <span class="micro">Raised in three months</span>
              <span class="stat__num" data-count="10000" data-prefix="$">$10,000</span>
              <div class="project__track" data-track aria-hidden="true"><span class="project__bar"><i></i></span><ol><li>Month 1</li><li>Month 2</li><li>Month 3</li></ol></div>
            </div>
            <div class="project__given">
              <span class="stat__num" data-count="3500" data-prefix="$" data-suffix="+">$3,500+</span>
              <span class="small">To Swim Across America for cancer research.</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="band" aria-labelledby="impact-numbers">
      <div class="wrap">
        <div class="shead"><h2 class="head" id="impact-numbers" data-anim="lines">The numbers.</h2></div>
        <div class="stats">
          <div class="stat" data-rise><span class="stat__num" data-count="35000" data-prefix="$" data-suffix="+">$35,000+</span><p>Raised by our students.</p></div>
          <div class="stat" data-rise><span class="stat__num" data-count="3500" data-prefix="$" data-suffix="+">$3,500+</span><p>To Swim Across America.</p></div>
          <div class="stat" data-rise><span class="stat__num" data-count="10" data-prefix="≈" data-suffix="%">≈10%</span><p>Of everything raised, to cancer research.</p></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="help-title">
      <div class="wrap shead shead--center" style="margin-bottom:0">
        <h2 class="head" id="help-title" data-anim="chars">Help it grow.</h2>
        <p class="lead" data-anim="blur">Request a tutor, or join us as one.</p>
        <div data-rise style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">{btn('Request a tutor', './#request')}{btn('Tutor with us', 'team#join', 'btn btn--ghost')}</div>
      </div>
    </section>
  </main>
''' + FOOT

# ---------------------------------------------------------------- subjects page
jump = '<ul class="jump" data-rise>' + ''.join(f'<li><a href="#{s[0]}">{s[2]}</a></li>' for s in SUBJECTS) + '</ul>'
subj_sections = '\n'.join(f'''      <article class="subject" id="{sid}" aria-labelledby="{sid}-title">
        <div class="subject__art" data-clip><span class="micro">{str(i + 1).zfill(2)} / {str(len(SUBJECTS)).zfill(2)}</span>{art(sid)}</div>
        <div class="subject__text">
          <h2 class="head" id="{sid}-title" data-anim="lines">{name}</h2>
          <p class="lead" data-anim="blur">{lead}</p>
          <ul class="tags" data-rise>{''.join(f'<li>{t}</li>' for t in topics)}</ul>
          {('<div class="by" data-rise>' + ''.join(f'<a href="team#{p}"><b aria-hidden="true">{initials(PEOPLE[p])}</b>{PEOPLE[p]}</a>' for p in tutors) + '</div>') if tutors else ''}
          <div data-rise>{btn(f"Request {short.lower() if sid != 'beyond' else 'this'} tutoring", f'./?subject={sid}#request')}</div>
        </div>
      </article>''' for i, (sid, name, short, lead, detail, topics, tutors) in enumerate(SUBJECTS))
subjects_page = head('Math, English, Science & Coding Tutoring | Eternal Growth', 'One-on-one and small-group tutoring in math, English, science, coding, music and social studies from Long Island high school students.', 'subjects', [crumbs('Subjects', 'subjects'), SUBJECTS_LD], 'CollectionPage') + f'''
  <main id="main">{hero('Subjects', 'Seven subjects, taught by officers who study, play or compete in them.', 'Elementary to high school', jump, cls='hero page-hero', orbit=True)}
    {ticker([(SUBJ_ICON[s[0]], s[1]) for s in SUBJECTS])}
    <div class="wrap">
{subj_sections}
    </div>
  </main>
''' + FOOT

# ---------------------------------------------------------------- team page
def person(pid, role, bio, rise=True):
    cut = bio.find('. ')
    head_txt, rest = (bio[:cut + 1], bio[cut + 1:]) if 0 < cut < len(bio) - 2 else (bio, '')
    more = f'<span class="bio-more">{rest}</span>' if rest else ''
    toggle = f'<button class="bio-toggle" type="button" aria-expanded="false"><span>Read more</span>{CHEV}</button>' if rest else ''
    r = ' data-rise' if rise else ''
    return f'''        <article class="person" id="{pid}"{r}>
          {plate(pid)}
          <h3>{PEOPLE[pid]}</h3>
          <p class="micro">{role}</p>
          <p class="bio">{head_txt}{more}</p>
          {toggle}
        </article>'''
def bio_parts(bio, full_under=0):
    if len(bio) <= full_under:
        return f'<p class="bio">{bio}</p>', ''
    cut = bio.find('. ')
    head_txt, rest = (bio[:cut + 1], bio[cut + 1:]) if 0 < cut < len(bio) - 2 else (bio, '')
    more = f'<span class="bio-more">{rest}</span>' if rest else ''
    toggle = f'<button class="bio-toggle" type="button" aria-expanded="false"><span>Read more</span>{CHEV}</button>' if rest else ''
    return f'<p class="bio">{head_txt}{more}</p>', toggle

def lead_card(pid, role, bio):
    roles = [role] + EXTRA_ROLES.get(pid, [])
    label = (f'<span class="visually-hidden">{" and ".join(roles)}</span><span aria-hidden="true" data-roles="{"|".join(roles)}">{roles[0]}</span>'
             if len(roles) > 1 else role)
    text, toggle = bio_parts(bio, 260)
    return f'''          <article class="lead-card" id="{pid}" data-rise data-layers>
            <div class="lead-card__plate" data-layer="0.25">{plate(pid)}</div>
            <div class="lead-card__body" data-layer="0.1">
              <p class="micro lead-card__role">{label}</p>
              <h3>{PEOPLE[pid]}</h3>
              {text}
              {toggle}
            </div>
          </article>'''

def founder_card(i, pid, role, bio):
    text, toggle = bio_parts(bio)
    speed = ['0.86', '0.78', '0.9', '0.82'][i % 4]
    return f'''          <article class="founder" id="{pid}" data-rise>
            <span class="founder__num" aria-hidden="true" data-speed="{speed}">{i + 1:02d}</span>
            {plate(pid)}
            <h3>{PEOPLE[pid]}</h3>
            <p class="micro">{role}</p>
            {text}
            {toggle}
          </article>'''

def alum_chip(pid, role, real=True):
    ident = f' id="{pid}"' if real else ''
    face = f'<b class="alum__photo"><img src="{PHOTOS[pid]}" alt="" width="96" height="96" loading="lazy" decoding="async"></b>' if pid in PHOTOS else f'<b aria-hidden="true">{initials(PEOPLE[pid])}</b>'
    return f'<li class="alum"{ident}>{face}<span>{PEOPLE[pid]}<small>Former {role}</small></span></li>'

def alumni_row(items, reverse=False):
    real = ''.join(alum_chip(*x) for x in items)
    dup = ''.join(alum_chip(*x, real=False) for x in items)
    rev = ' data-reverse' if reverse else ''
    return f'<div class="marquee__row"{rev}><ul class="marquee__track">{real}</ul><ul class="marquee__track" aria-hidden="true">{dup}</ul><ul class="marquee__track" aria-hidden="true">{dup}</ul></div>'

LEADS = [o for o in OFFICERS if o[1] == 'Co-President']
CREW = [o for o in OFFICERS if o[1] != 'Co-President']
half = (len(ALUMNI) + 1) // 2
TEAM_INDEX = ''.join(f'<a href="#{k}" data-cursor="Jump"><span class="micro">{i + 1:02d}</span><b>{label}</b><i>{n}</i></a>'
                     for i, (k, label, n) in enumerate([('officers', 'Officers', len(OFFICERS)), ('founders', 'Founders', len(FOUNDERS)), ('alumni', 'Alumni', len(ALUMNI))]))
team_page = head('Our team: officers, founders and alumni | Eternal Growth', 'Meet the high school officers, founders and alumni behind Eternal Growth, a student-run tutoring nonprofit on Long Island, New York.', 'team', [crumbs('Team', 'team'), TEAM_LD]) + f'''
  <main id="main">{hero('The team', f'{COUNT.capitalize()} officers, seven founders, {WORDS[len(ALUMNI)]} alumni. All students.', 'Mostly from Syosset', btn('Tutor with us', '#join', 'btn btn--ghost'), cls='hero page-hero')}
    {ticker([('one', PEOPLE[p]) for p, _, _ in OFFICERS])}
    <section class="section" aria-label="Team sections" style="padding-block:clamp(40px, 5vw, 72px) 0">
      <nav class="wrap team-index" aria-label="Jump to" data-rise>{TEAM_INDEX}</nav>
    </section>

    <section class="section" id="officers" aria-labelledby="officers-title">
      <div class="wrap">
        <div class="shead"><div class="shead__kicker"><p class="micro" data-anim="scramble">01 · Officers</p><h2 class="head" id="officers-title" data-anim="lines">Leadership.</h2></div><p class="lead" data-anim="blur">{COUNT.capitalize()} students run Eternal Growth. They tutor, raise money and keep it growing.</p></div>
        <div class="leads">
{chr(10).join(lead_card(*o) for o in LEADS)}
        </div>
        <div class="crew">
{chr(10).join(person(o[0], role_of(o[0], o[1]), o[2]) for o in CREW)}
        </div>
      </div>
    </section>

    <section class="band team-founders" id="founders" aria-labelledby="founders-title">
      <div class="wrap">
        <div class="shead"><div class="shead__kicker"><p class="micro" data-anim="scramble">02 · Founders</p><h2 class="head" id="founders-title" data-anim="lines">Where it started.</h2></div><p class="lead" data-anim="blur">Seven students from Syosset and Jericho planted Eternal Growth. Meet {WORDS[len(FOUNDERS)]} of them.</p></div>
        <div class="founders">
{chr(10).join(founder_card(i, *f) for i, f in enumerate(FOUNDERS))}
        </div>
      </div>
    </section>

    <section class="section" id="alumni" aria-labelledby="alumni-title">
      <div class="wrap">
        <div class="shead"><div class="shead__kicker"><p class="micro" data-anim="scramble">03 · Alumni</p><h2 class="head" id="alumni-title" data-anim="lines">The alumni.</h2></div><p class="lead" data-anim="blur">Former officers who built what Eternal Growth is today.</p></div>
      </div>
      <div class="marquee" data-marquee>
        {alumni_row(ALUMNI[:half])}
        {alumni_row(ALUMNI[half:], reverse=True)}
      </div>
    </section>

    <section class="section" id="join" aria-labelledby="join-title" style="padding-top:0">
      <div class="wrap">
        <div class="shead shead--center"><h2 class="head" id="join-title" data-anim="scale">Tutor with us.</h2><p class="lead" data-anim="blur">High schoolers who love a subject and like explaining it.</p></div>
        <div class="cards">
          {card('teach', 'A love of teaching', 'You notice the moment it clicks.')}
          {card('ahead', 'Depth in a subject', 'You can explain it three different ways.')}
          {card('grow', 'A growth mindset', 'Every student can improve with support.')}
        </div>
        <div data-rise style="display:flex;justify-content:center;margin-top:36px">{btn('Write to us', 'mailto:info@eternalgrowth.org?subject=I%20want%20to%20tutor%20with%20Eternal%20Growth')}</div>
      </div>
    </section>
  </main>
''' + FOOT

# ---------------------------------------------------------------- about page
about_page = head('About Eternal Growth | Student-run tutoring nonprofit', 'Why seven Long Island high school students started Eternal Growth, how tutors are matched, where sessions happen and where the money goes.', 'about', [crumbs('About', 'about'), FAQ_LD], 'AboutPage') + f'''
  <main id="main">{hero('About', 'A nonprofit making education easier to reach, run by Long Island high schoolers.', 'Founded by seven students', '', cls='hero page-hero')}
    {ticker([('one', 'Students teaching students'), ('given', 'Giving back'), ('run', 'Run by students'), ('seed', 'Since day one, growing')])}
    <section class="section" id="story" aria-labelledby="story-title">
      <div class="wrap columns2">
        <div><h2 class="head" id="story-title" data-anim="chars">Why we started.</h2></div>
        <div>
          <p class="lead" data-anim="blur">Seven students from Syosset and Jericho wanted good tutoring to be easier to reach.</p>
          <p data-rise>They did it the direct way: older students teaching younger ones.</p>
          <p data-rise>A high schooler remembers what made algebra click. That memory is the method.</p>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="m-title" style="padding-top:0">
      <div class="wrap manifesto">
        <h2 class="micro" id="m-title" data-anim="scramble">In one sentence</h2>
        <p class="manifesto__text" data-anim="fill">Good teaching should not depend on who you know or what you can pay.</p>
      </div>
    </section>
    <section class="section" id="values" aria-labelledby="values-title">
      <div class="wrap">
        <div class="shead shead--center"><h2 class="head" id="values-title" data-anim="flip">What we hold to.</h2></div>
        <div class="cards">
          {card('teach', 'Teach it well', 'A tutor who knows it and takes the time.')}
          {card('open', 'Open to everyone', 'Whatever the background, whatever the pace.')}
          {card('stick', 'Make it stick', 'Games, projects, real examples.')}
        </div>
      </div>
    </section>
    <section class="band" aria-labelledby="money-title">
      <div class="wrap">
        <div class="shead"><h2 class="head" id="money-title" data-anim="lines">Where the money goes.</h2><p class="lead" data-anim="blur">More than $35,000 raised; more than $3,500 to cancer research; tutoring subsidized.</p></div>
        {btn('See our impact', 'impact', 'btn btn--light')}
      </div>
    </section>
    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="wrap faq-wrap">
        <div><h2 class="head" id="faq-title" data-anim="chars">Questions.</h2><p class="lead" data-anim="blur">Anything else: <a href="mailto:info@eternalgrowth.org" style="color:var(--ink);text-decoration:underline;text-underline-offset:0.2em">info@eternalgrowth.org</a></p></div>
        {faq_list(FAQ, 'aq')}
      </div>
    </section>
  </main>
''' + FOOT

import datetime
today = datetime.date.today().isoformat()
urls = [('', '1.0'), ('subjects', '0.9'), ('impact', '0.8'), ('about', '0.8'), ('team', '0.6')]
open(f'{ROOT}/sitemap.xml', 'w', encoding='utf-8', newline='\n').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>\n' for u, pr in urls) + '</urlset>\n')
open(f'{ROOT}/robots.txt', 'w', encoding='utf-8', newline='\n').write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n')
notfound = head('Page not found | Eternal Growth', 'This page does not exist. Find tutoring subjects, our impact and the team at Eternal Growth.', '404.html', index=False) + f'''
  <main id="main">{hero('Not found', 'That page is not here. Try one of these instead.', '404', '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' + btn('Back to home', './') + btn('See subjects', 'subjects', 'btn btn--ghost') + '</div>', cls='hero page-hero')}
  </main>
''' + FOOT
notfound = notfound.replace('<head>', '<head>\n  <base href="/">', 1)
import json as _j
open(f'{ROOT}/site.webmanifest', 'w', encoding='utf-8', newline='\n').write(_j.dumps({
    'name': 'Eternal Growth', 'short_name': 'Eternal Growth', 'description': 'Student-run tutoring on Long Island.',
    'start_url': '/', 'scope': '/', 'display': 'standalone', 'background_color': '#f2f2ef', 'theme_color': '#f2f2ef',
    'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
              {'src': 'icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}, indent=2) + '\n')
llms = ['# Eternal Growth', '', '> A student-run tutoring nonprofit on Long Island, New York. High school students, mostly from Syosset and Jericho, tutor elementary, middle and high school students one-on-one, in small groups and online. Eternal Growth has raised more than $35,000, given more than $3,500 to Swim Across America for cancer research, and subsidizes tutoring.', '',
        '## Pages', '', f'- [Home]({SITE}): what Eternal Growth does and how to request a tutor', f'- [Subjects]({SITE}subjects): every subject, its topics and its tutors',
        f'- [Impact]({SITE}impact): money raised, where it went, and projects such as the $10,000 Swim Across America drive', f'- [About]({SITE}about): why Eternal Growth started, values and questions', f'- [Team]({SITE}team): officers, founders and alumni', '',
        '## Projects', '', '- The Swim Across America drive: led by Victor Pan with Katherine Fei and Sue Nian, it raised $10,000 in three months, more than $3,500 of it for cancer research.', '', '## Subjects', ''] + [f'- {x[1]}: {x[3]}' for x in SUBJECTS] + ['', '## Questions', ''] + [f'- {q} {re.sub("<[^>]+>", "", a)}' for q, a in FAQ] + ['', '## Contact', '', '- Email: info@eternalgrowth.org', f'- Request a tutor: {SITE}#request', '']
open(f'{ROOT}/llms.txt', 'w', encoding='utf-8', newline='\n').write('\n'.join(llms))
for name, body in [('404.html', notfound), ('index.html', home), ('impact.html', impact_page), ('subjects.html', subjects_page), ('team.html', team_page), ('about.html', about_page)]:
    open(f'{ROOT}/{name}', 'w', encoding='utf-8', newline='\n').write(body)
    print('wrote', name)
