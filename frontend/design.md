# Design System — Dot Grid Pastel

## 1. Vue d'ensemble

Ce design system s'inspire du style **Dot Grid** (grille de points) utilisé par les outils de diagrammation comme draw.io, Mermaid et Excalidraw. Le motif de points discrets en arrière-plan sert de référence subtile pour l'alignement visuel, tout en maintenant une esthétique légère et aérée.

La palette de couleurs est entièrement basée sur des **tons pastels** — doux, apaisants et modernes.

---

## 2. Philosophie

- **Clarté avant tout** : la grille de points guide l'œil sans imposer
- **Légèreté** : pas de bordures lourdes, pas d'ombres agressives
- **Harmonie pastel** : chaque couleur est désaturée et lumineuse
- **Respiration** : beaucoup d'espace blanc (ou quasi-blanc) entre les éléments

---

## 3. Palette de Couleurs — Pastel

### 3.1 Couleurs de fond (Backgrounds)

| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Blanc Cassé** | `#FDFBF7` | Fond principal de page |
| **Lavande Pâle** | `#F3F0FF` | Fond de sections alternées |
| **Bleu Ciel** | `#E8F4FD` | Fond de cartes / panneaux |
| **Vert Menthe** | `#E6F7F0` | Fond de confirmation / succès |
| **Rose Poudré** | `#FFF0F3` | Fond d'alerte douce / mise en avant |
| **Pêche** | `#FFF5EE` | Fond de sections chaudes |

### 3.2 Couleurs de texte

| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Ardoise** | `#4A5568` | Texte principal |
| **Ardoise Clair** | `#718096` | Texte secondaire / labels |
| **Ardoise Très Clair** | `#A0AEC0` | Texte désactivé / placeholders |
| **Ardoise Foncé** | `#2D3748` | Titres / texte important |

### 3.3 Couleurs d'accent (Pastel)

| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Lavande** | `#A78BFA` | Accent principal / liens |
| **Bleu Pastel** | `#7DD3FC` | Accent secondaire / boutons |
| **Vert Pastel** | `#86EFAC` | Succès / validation |
| **Rose Pastel** | `#FDA4AF` | Alertes / notifications douces |
| **Jaune Pastel** | `#FDE047` | Mise en garde / highlight |
| **Corail Pastel** | `#FCA5A5` | Actions importantes |

### 3.4 Couleurs de la grille de points

| Nom | Hex | Opacité | Utilisation |
|-----|-----|---------|-------------|
| **Point Standard** | `#A0AEC0` | 15% | Grille par défaut |
| **Point Subtil** | `#A0AEC0` | 8% | Grille discrète (mode focus) |
| **Point Accent** | `#A78BFA` | 25% | Grille en mode édition |

---

## 4. La Grille de Points (Dot Grid)

### 4.1 Spécifications techniques

```css
.dot-grid-background {
  background-color: #FDFBF7;
  background-image: radial-gradient(
    circle at center,
    rgba(160, 174, 192, 0.15) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

### 4.2 Variantes de la grille

| Variante | Taille des points | Espacement | Opacité | Usage |
|----------|-------------------|------------|---------|-------|
| **Fine** | 1px | 16px | 10% | Interfaces denses, dashboards |
| **Standard** | 1.5px | 24px | 15% | Usage général, éditeurs |
| **Large** | 2px | 32px | 12% | Présentations, slides |
| **Focus** | 1px | 24px | 6% | Mode lecture sans distraction |

### 4.3 Grille avec couleur d'accent

```css
.dot-grid-accent {
  background-color: #FDFBF7;
  background-image: radial-gradient(
    circle at center,
    rgba(167, 139, 250, 0.20) 1.5px,
    transparent 1.5px
  );
  background-size: 24px 24px;
}
```

---

## 5. Typographie

### 5.1 Polices recommandées

| Rôle | Police | Fallback |
|------|--------|----------|
| Titres | **Inter** | system-ui, sans-serif |
| Corps de texte | **Inter** | system-ui, sans-serif |
| Code / Technique | **JetBrains Mono** | monospace |

### 5.2 Échelle typographique

| Niveau | Taille | Poids | Hauteur de ligne | Lettrage |
|--------|--------|-------|------------------|----------|
| H1 | 48px | 700 | 1.1 | -0.02em |
| H2 | 36px | 600 | 1.2 | -0.01em |
| H3 | 28px | 600 | 1.3 | 0 |
| H4 | 22px | 500 | 1.4 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Body Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 500 | 1.4 | 0.01em |

### 5.3 Couleurs typographiques

- **Titres** : `#2D3748` (Ardoise Foncé)
- **Texte principal** : `#4A5568` (Ardoise)
- **Texte secondaire** : `#718096` (Ardoise Clair)
- **Liens** : `#A78BFA` (Lavande) — hover `#8B5CF6`

---

## 6. Composants UI

### 6.1 Boutons

#### Bouton Primaire (Pastel)
```
Fond : #E8F4FD (Bleu Ciel)
Texte : #2D3748 (Ardoise Foncé)
Bordure : 1px solid #BFDBFE
Radius : 12px
Padding : 12px 24px
Hover : fond #BFDBFE, légère élévation
```

#### Bouton Secondaire
```
Fond : transparent
Texte : #4A5568 (Ardoise)
Bordure : 1px solid #E2E8F0
Radius : 12px
Padding : 12px 24px
Hover : fond #F3F0FF (Lavande Pâle)
```

#### Bouton Ghost
```
Fond : transparent
Texte : #718096 (Ardoise Clair)
Bordure : none
Radius : 8px
Padding : 8px 16px
Hover : fond rgba(160, 174, 192, 0.10)
```

### 6.2 Cartes (Cards)

```
Fond : #FFFFFF
Bordure : 1px solid #E2E8F0
Radius : 16px
Padding : 24px
Ombre : 0 1px 3px rgba(0, 0, 0, 0.04)
Hover : ombre 0 4px 12px rgba(0, 0, 0, 0.06)
```

**Variante sur fond coloré :**
```
Fond : #E8F4FD (ou autre pastel)
Bordure : none
Radius : 16px
Padding : 24px
```

### 6.3 Inputs / Champs de texte

```
Fond : #FFFFFF
Bordure : 1px solid #E2E8F0
Radius : 12px
Padding : 12px 16px
Texte : #4A5568
Placeholder : #A0AEC0
Focus : bordure #A78BFA (Lavande), ombre 0 0 0 3px rgba(167, 139, 250, 0.15)
```

### 6.4 Badges / Tags

| Type | Fond | Texte | Bordure |
|------|------|-------|---------|
| Info | `#E8F4FD` | `#0369A1` | `#BFDBFE` |
| Succès | `#E6F7F0` | `#15803D` | `#86EFAC` |
| Avertissement | `#FEF9C3` | `#A16207` | `#FDE047` |
| Erreur douce | `#FFF0F3` | `#BE123C` | `#FDA4AF` |
| Neutre | `#F3F0FF` | `#7C3AED` | `#A78BFA` |

### 6.5 Navigation / Sidebar

```
Fond : #FFFFFF
Bordure droite : 1px solid #E2E8F0
Largeur : 260px
Item inactif : texte #718096
Item actif : fond #F3F0FF, texte #7C3AED, indicateur gauche 3px #A78BFA
Item hover : fond rgba(243, 240, 255, 0.5)
```

---

## 7. Espacement et Layout

### 7.1 Système d'espacement (8px base)

| Token | Valeur |
|-------|--------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 24px |
| space-6 | 32px |
| space-7 | 48px |
| space-8 | 64px |
| space-9 | 96px |
| space-10 | 128px |

### 7.2 Grille de layout

- **Container max-width** : 1200px
- **Gouttières** : 24px (desktop), 16px (mobile)
- **Colonnes** : 12 sur desktop, 6 sur tablette, 4 sur mobile

### 7.3 Points d'arrêt (Breakpoints)

| Nom | Largeur |
|-----|---------|
| Mobile | < 640px |
| Tablette | 640px - 1024px |
| Desktop | 1024px - 1280px |
| Large | > 1280px |

---

## 8. Effets et Animations

### 8.1 Ombres (Shadows)

| Nom | Valeur | Usage |
|-----|--------|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.04)` | Inputs, badges |
| shadow-md | `0 4px 6px rgba(0,0,0,0.04)` | Cartes, dropdowns |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.05)` | Modales, popovers |
| shadow-xl | `0 20px 25px rgba(0,0,0,0.06)` | Toasts, notifications |
| shadow-dot | `0 0 0 1px rgba(167,139,250,0.2)` | Focus rings pastel |

### 8.2 Transitions

```css
/* Standard */
transition: all 0.2s ease-in-out;

/* Hover doux */
transition: background-color 0.15s ease, transform 0.2s ease;

/* Apparition */
transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### 8.3 Animations de la grille

```css
/* Grille qui apparaît en fondu */
@keyframes gridFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dot-grid-animated {
  animation: gridFadeIn 0.6s ease-out;
}
```

---

## 9. Exemples de Mise en Page

### 9.1 Page d'accueil type (Éditeur visuel)

```
┌─────────────────────────────────────────────────────────────┐
│  [Sidebar]                              [Zone principale]   │
│  Fond: #FFFFFF                          Fond: #FDFBF7       │
│  Bordure droite: #E2E8F0                + Dot Grid            │
│                                                             │
│  ┌─────────────┐                                            │
│  │  🎨 Outils   │         ┌─────────────────────────────┐   │
│  │  ⬜ Formes   │         │                             │   │
│  │  📝 Texte    │         │    ·  ·  ·  ·  ·  ·  ·  ·   │   │
│  │  🔗 Liens    │         │    ·  ·  ·  ·  ·  ·  ·  ·   │   │
│  │             │         │    ·  ·  [Carte]  ·  ·  ·   │   │
│  │  ─────────  │         │    ·  ·  ·  ·  ·  ·  ·  ·   │   │
│  │  ⚙️ Param.  │         │    ·  ·  ·  ·  ·  ·  ·  ·   │   │
│  └─────────────┘         │                             │   │
│                          └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Dashboard avec cartes pastel

```
┌─────────────────────────────────────────────────────────────┐
│  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·   │  ← Dot Grid
│  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·   │
│  ·  ┌──────────┐  ┌──────────┐  ┌──────────┐  ·  ·  ·  ·   │
│  ·  │  Bleu    │  │  Vert    │  │  Rose    │  ·  ·  ·  ·   │
│  ·  │  Ciel    │  │  Menthe  │  │  Poudré  │  ·  ·  ·  ·   │
│  ·  │  #E8F4FD │  │  #E6F7F0 │  │  #FFF0F3 │  ·  ·  ·  ·   │
│  ·  └──────────┘  └──────────┘  └──────────┘  ·  ·  ·  ·   │
│  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·   │
│  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·   │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Code CSS Complet (Starter)

```css
/* ============================================
   DOT GRID PASTEL — Design System CSS
   ============================================ */

:root {
  /* Couleurs de fond */
  --bg-primary: #FDFBF7;
  --bg-lavender: #F3F0FF;
  --bg-sky: #E8F4FD;
  --bg-mint: #E6F7F0;
  --bg-rose: #FFF0F3;
  --bg-peach: #FFF5EE;
  --bg-white: #FFFFFF;

  /* Couleurs de texte */
  --text-primary: #4A5568;
  --text-secondary: #718096;
  --text-muted: #A0AEC0;
  --text-heading: #2D3748;

  /* Accents pastel */
  --accent-lavender: #A78BFA;
  --accent-lavender-dark: #8B5CF6;
  --accent-sky: #7DD3FC;
  --accent-mint: #86EFAC;
  --accent-rose: #FDA4AF;
  --accent-yellow: #FDE047;
  --accent-coral: #FCA5A5;

  /* Bordures */
  --border-light: #E2E8F0;
  --border-sky: #BFDBFE;

  /* Grille */
  --grid-color: rgba(160, 174, 192, 0.15);
  --grid-size: 24px;
  --grid-dot-size: 1.5px;

  /* Espacement */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05);
}

/* Grille de points de base */
.dot-grid {
  background-color: var(--bg-primary);
  background-image: radial-gradient(
    circle at center,
    var(--grid-color) var(--grid-dot-size),
    transparent var(--grid-dot-size)
  );
  background-size: var(--grid-size) var(--grid-size);
}

/* Grille fine (dashboard dense) */
.dot-grid-fine {
  --grid-size: 16px;
  --grid-dot-size: 1px;
  --grid-color: rgba(160, 174, 192, 0.10);
}

/* Grille large (présentations) */
.dot-grid-large {
  --grid-size: 32px;
  --grid-dot-size: 2px;
  --grid-color: rgba(160, 174, 192, 0.12);
}

/* Grille accent (mode édition) */
.dot-grid-accent {
  --grid-color: rgba(167, 139, 250, 0.20);
  --grid-dot-size: 1.5px;
}

/* Grille focus (lecture) */
.dot-grid-focus {
  --grid-color: rgba(160, 174, 192, 0.06);
}

/* Composants */
.card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-pastel-sky {
  background: var(--bg-sky);
  border: none;
}

.card-pastel-mint {
  background: var(--bg-mint);
  border: none;
}

.card-pastel-rose {
  background: var(--bg-rose);
  border: none;
}

.btn-primary {
  background: var(--bg-sky);
  color: var(--text-heading);
  border: 1px solid var(--border-sky);
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary:hover {
  background: var(--border-sky);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--bg-lavender);
  border-color: var(--accent-lavender);
}

.input-pastel {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.15s ease;
}

.input-pastel::placeholder {
  color: var(--text-muted);
}

.input-pastel:focus {
  outline: none;
  border-color: var(--accent-lavender);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

/* Badge pastel */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.badge-info {
  background: var(--bg-sky);
  color: #0369A1;
  border: 1px solid var(--border-sky);
}

.badge-success {
  background: var(--bg-mint);
  color: #15803D;
  border: 1px solid var(--accent-mint);
}

.badge-warning {
  background: #FEF9C3;
  color: #A16207;
  border: 1px solid var(--accent-yellow);
}

.badge-error {
  background: var(--bg-rose);
  color: #BE123C;
  border: 1px solid var(--accent-rose);
}

.badge-neutral {
  background: var(--bg-lavender);
  color: #7C3AED;
  border: 1px solid var(--accent-lavender);
}

/* Sidebar */
.sidebar {
  background: var(--bg-white);
  border-right: 1px solid var(--border-light);
  width: 260px;
  height: 100vh;
}

.sidebar-item {
  padding: 12px 16px;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  margin: 4px 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sidebar-item:hover {
  background: rgba(243, 240, 255, 0.5);
}

.sidebar-item.active {
  background: var(--bg-lavender);
  color: #7C3AED;
  border-left: 3px solid var(--accent-lavender);
}

/* Animation d'apparition de la grille */
@keyframes gridFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dot-grid-animated {
  animation: gridFadeIn 0.6s ease-out;
}
```

---

## 11. Bonnes Pratiques

1. **Ne jamais utiliser la grille sur du texte** — la grille est un fond, pas un motif de surface
2. **Varier l'opacité selon le contexte** — plus l'interface est dense, plus la grille doit être discrète
3. **Utiliser les cartes pastel pour créer des zones** — elles apportent de la couleur sans agressivité
4. **Préférer les bordures fines aux ombres lourdes** — l'esthétique pastel demande de la légèreté
5. **Maintenir un contraste suffisant** — les pastels sont doux, mais le texte doit rester lisible (WCAG AA minimum)
6. **Animer subtilement** — les transitions doivent être rapides (0.15s–0.3s) et fluides

---

## 12. Références et Inspirations

- **draw.io / diagrams.net** — grille de points classique pour l'édition de diagrammes
- **Mermaid Live Editor** — arrière-plan minimaliste avec grille subtile
- **Excalidraw** — grille de points avec esthétique hand-drawn
- **Figma** — grille de points configurable (View → Pixel Grid)
- **Aceternity UI** — composants avec backgrounds dot grid modernes
- **Tailwind CSS** — système de couleurs pastel (sky, rose, violet, emerald)

---

*Design System — Dot Grid Pastel v1.0*
*Créé pour des interfaces légères, aérées et harmonieuses.*
