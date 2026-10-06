# V4.5 Image 2.5 Art Targets

Drop the six user-generated Image 2.5 keyframes here with EXACTLY these names:

- 01_attention.png    — ATTENTION / SIGNAL FLOOD
- 02_filter.png       — FILTER / PRIORITY
- 03_searchlight.png  — SEARCHLIGHT / WORKSPACE
- 04_linking.png      — LINKING / NETWORK TO TRACK
- 05_choice.png       — CHOICE / FORK
- 06_growth.png       — PAGE / TIME / GROWTH

These are ART TARGETS, not backgrounds. The Remotion scenes rebuild them from
layers. To compare inside a render:

    npx remotion still src/v45/index.tsx V45Attention out/check.png \
      --frame=96 --props='{"reference":true,"overlay":50}'

The review page (v45-keyframe-review.html) shows reference vs render with a
wipe slider once the files exist here.
