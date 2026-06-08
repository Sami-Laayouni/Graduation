import { readFileSync, writeFileSync } from "fs";

const path = "src/lib/speech-sections.ts";
let t = readFileSync(path, "utf8");

const map = {
  asi_intro: "leaf_fragment",
  ameur_1: "leaf_fragment",
  ameur_2: "leaf_fragment",
  ameur_3: "leaf_fragment",
  zineb: "leaf_fragment",
  digital: "leaf_fragment",
  friendships: "leaf_fragment",
  memories_1: "leaf_fragment",
  memories_2: "leaf_reveal",
  search_1: "leaf_reveal",
  search_2: "leaf_reveal",
  search_3: "leaf_reveal",
  main_1: "leaf_reveal",
  main_2: "leaf_reveal",
  science_1: "leaf_reveal",
  science_2: "single_leaf",
};

for (const [id, st] of Object.entries(map)) {
  const re = new RegExp(
    `(id: "${id}"[\\s\\S]*?projectorState: )"[^"]+"`,
    "m"
  );
  t = t.replace(re, `$1"${st}"`);
}

writeFileSync(path, t);
console.log("Updated ASI leaf projector states");
