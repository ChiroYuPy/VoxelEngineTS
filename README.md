# 🧱 Voxel Engine TS

Un moteur de rendu de voxels en **TypeScript**, conçu pour être **performant**, **lisible** et **modulaire**. Il s'appuie sur **WebGL** pour afficher dynamiquement un monde voxelisé directement dans le navigateur, avec une architecture évolutive et orientée développement moderne.

## ✨ Fonctionnalités principales

- 🌍 Génération automatique de chunks en voxels
- ⚙️ Construction de mesh optimisé par suppression des faces cachées et fusion des faces adjacentes
- 📦 Format de sommet optimisé pour une gestion mémoire éfficace
- 🔄 Reconstruction dynamique des chunks modifiés ou connexe a un block modifié
- 🖱️ Contrôles de caméra fps

## 🧰 Technologies utilisées

- **TypeScript** meilleur typage js
- **WebGL** via THREE.js
- **GLSL** shaders OpenGL
- **Vite** bundler

## 🚀 Installation rapide

```bash
git clone git@github.com:ChiroYuPy/VoxelEngineTS.git
cd VoxelEngineTS
npm install
npm run dev
```

## 🎮 Commandes clavier (par défaut)

| Touche  | Action               |
|---------|----------------------|
| Z/Q/S/D | Déplacement          |
| Espace  | Monter               |
| Shift   | Descendre            |
| Souris  | Orientation caméra   |

## ⚙️ Fichier de configuration

Modifie les constantes dans `src/constants.ts` pour ajuster :
- La taille des chunks
- La hauteur maximale
- Les couleurs ou textures associées aux voxels

---

# 🗺️ Roadmap

### 🔰 1. Base minimale
- Structure des voxels et chunks ✅
- Rendu THREE.js avec gestion des faces visibles ✅
- Contrôle de la caméra ✅

### 🔄 2. Moteur dynamique
- Reconstruction des chunks modifiés ✅
- Placement/destruction de blocs en temps réel ✅
- Système de sauvegarde/chargement

### 🎨 3. Esthétique et shaders
- gestion textures: atlas ✅
- Shaders de rendu ( au lieu d'un material simple ) ✅
- Éclairage statique ✅

### 🌍 4. Monde étendu
- Grille de chunks chargés/déchargés autour du joueur ✅
- Optimisations : culling, niveau de détail (LOD)

### 🧰 5. Outils de développement
- Debug overlay
- Mode édition en direct
- Visualisation des normales ou wireframes

### 🌱 6. Génération procédurale
- Génération de terrain avec bruit ✅
- Système de biomes
- Structures naturelles (arbres, grottes…)

### 🕹️ 7. Simulation et gameplay
- Gravité, collisions ✅
- Sélection et inventaire de blocs
- Blocs interactifs (eau, feu, etc.)

### 🌐 8. Multijoueur et persistance
- Synchronisation réseau
- Sauvegarde serveur
- Base de données

### 🧪 9. Qualité et publication
- Tests unitaires
- Documentation API
- Démo publique hébergée

---

© 2025 - Projet personnel open source. Contributions bienvenues !
