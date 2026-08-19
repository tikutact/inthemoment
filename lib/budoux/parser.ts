/**
 * BudouX の分割器（v0.9.0 の dist/parser.js を TypeScript に移植したもの）。
 *
 * @license
 * Copyright 2021 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * npm の budoux をそのまま入れると google-artifactregistry-auth など65パッケージが付いてくるが、
 * 使うのは文字列を文節に割るこの1クラスだけなので、モデルごと取り込んで依存を0にした（2026-08-19）。
 */
import { MODEL_JA } from "./model-ja";

// スコアの特徴量。i を境界候補として、その前後の1〜3文字の並びを見る
const FEATURES = [
  ["UW1", -3, -2], ["UW2", -2, -1], ["UW3", -1, 0], ["UW4", 0, 1], ["UW5", 1, 2], ["UW6", 2, 3],
  ["BW1", -2, 0], ["BW2", -1, 1], ["BW3", 0, 2],
  ["TW1", -3, 0], ["TW2", -2, 1], ["TW3", -1, 2], ["TW4", 0, 3],
] as const;

export class Parser {
  private readonly model: Map<string, Map<string, number>>;
  private readonly baseScore: number;

  constructor(model: Record<string, Record<string, number>>) {
    this.model = new Map(
      Object.entries(model).map(([k, v]) => [k, new Map(Object.entries(v))])
    );
    this.baseScore =
      -0.5 *
      [...this.model.values()]
        .flatMap((group) => [...group.values()])
        .reduce((prev, curr) => prev + curr, 0);
  }

  /** 文を文節のリストに割る */
  parse(sentence: string): string[] {
    if (sentence === "") return [];
    const result: string[] = [];
    let start = 0;
    for (const boundary of this.parseBoundaries(sentence)) {
      result.push(sentence.slice(start, boundary));
      start = boundary;
    }
    result.push(sentence.slice(start));
    return result;
  }

  /** 文節の切れ目になる位置（文字数）のリスト */
  parseBoundaries(sentence: string): number[] {
    const result: number[] = [];
    for (let i = 1; i < sentence.length; i++) {
      let score = this.baseScore;
      // モデルのスコアは負の値も取りうる
      for (const [name, from, to] of FEATURES) {
        score += this.model.get(name)?.get(sentence.substring(i + from, i + to)) ?? 0;
      }
      if (score > 0) result.push(i);
    }
    return result;
  }
}

/** 日本語モデルを積んだ分割器 */
export function loadJapaneseParser(): Parser {
  return new Parser(MODEL_JA);
}
