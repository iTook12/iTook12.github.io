# iKnowThis

## フロントエンド

### アプリ処理

1. 新しいカテゴリの単語を表示する。表示する単語は`pageview rank`が最も高いもの(`A`)とする。
2. 表示された単語に対して、ユーザーは「知ってる！」「聞いたことある」「知らない……」の3種類の中から該当するものを選択する。選択肢によりその単語が該当するカテゴリに対する`category point`が加算される。
3. 処理1〜2を4回まで同一カテゴリかつ同一`pageview rank`の単語で繰り返す。`category point`が一定ポイントに満たない場合、処理1に戻り新しいカテゴリに移る。`category point`が一定を超えた場合、次の処理に進む。
4. 直前の単語の`pageview rank`より低い単語を表示する。
5. その後、処理2〜4の流れを`pageview rank`が`D`になるまで繰り返す。

### キーワード

- `pageview rank`(仮)
  - カテゴリ内における単語のページビューに基づくランク。ページビューの多い順からA,B,C,Dの4種類に分かれる。
  - `pageview rank`のランク付けは以下のように分けられる。
    - `A`はトップ5%以上
    - `B`は5%未満〜20%以上
    - `C`は20%未満〜40%以上
    - `D`は40%未満すべて
- `category point`
  - 単語に対する3種類の選択肢を選ぶことでカテゴリに紐付いて加算されるポイント。「知ってる！」で5point、「聞いたことある」で3point、「知らない」で0point加算される。

### データ構造

#### wordデータ

| Name | Alias | Description |
|---|---|---|
| word | 単語 |  |
| category | カテゴリ |  |
| pageview_rank | ページビューランク | A,B,C,Dで設定されるページビューに基づくランク |

## バックエンド（サーバーサイド）

バックエンドではWikipediaの情報をAPIにより取得し、加工する。

### 処理

下記データを取得し、フロントエンドに渡すためのデータを格納するDBを構築する。

- 単語とカテゴリ
- 単語とページビュー

#### データ取得処理

1. 単語とカテゴリとURLを取得しDBに格納する。
2. 格納された単語のURLから単語のページビューを取得し、DBに格納する。

#### `pageview rank`設定処理

TODO: タイミングはどうするか？

1. 1カテゴリについて単語を`pageview`順に並べる。
2. 上位5%にランク`A`を設定する。
3. 5%未満〜20%以上に`B`を設定する。
4. 20%未満〜40%以上に`C`を設定する。
5. 40%未満すべてに`D`を設定する。

### テーブル

#### `main_data` テーブル

| Name | Alias | Description |
|---|---|---|
| word | 単語 |  |
| category | カテゴリ |  |
| pageview | ページビュー | 単語のページビュー |
| pageview_rank | ページビューランク | A,B,C,Dで設定されるページビューに基づくランク |

#### `pageview_rank` テーブル

| Name | Alias | Description |
|---|---|---|
| category | カテゴリ |  |
| a_threshold | A閾値 | カテゴリ内でページビューランクがAになる閾値 |
| b_threshold | B閾値 | カテゴリ内でページビューランクがBになる閾値 |
| c_threshold | C閾値 | カテゴリ内でページビューランクがCになる閾値 |
| d_threshold | D閾値 | カテゴリ内でページビューランクがDになる閾値 |

データはカテゴリ単位で取得する。取得するデータ単位は下記の通りにする。

同一カテゴリ
pageview_rank 
select 
