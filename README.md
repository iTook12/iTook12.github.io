# iKnowThis（仮）

## フロントエンド

### アプリ処理

1. アニメの作品名を表示する．
2. 表示された作品名に対して，ユーザーは「知ってる！」「聞いたことある」「知らない……」の3種類の中から該当するものを選択する．
3. 選択肢によりその作品が該当するカテゴリに対する`category point`が加算される．

### キーワード

- `category point`
  - 作品名に対する3種類の選択肢を選ぶことでカテゴリに紐付いて加算されるポイント．「知ってる！」で5point，「聞いたことある」で3point，「知らない」で0point加算される．

### データ構造

#### titleデータ

| Name | Alias | Description |
|---|---|---|
| title | 作品名 |  |
| category | カテゴリ |  |

## バックエンド（サーバーサイド）

バックエンドではWikipediaの情報をAPIにより取得し，加工する．

### 処理

下記データを取得し，フロントエンドに渡すためのデータを格納するDBを構築する．

- 作品名とカテゴリ

#### データ取得処理

1. 作品名とカテゴリとURLを取得しDBに格納する．

### テーブル

#### `main_data` テーブル

| Name | Alias | Description |
|---|---|---|
| title | 作品名 |  |
| category | カテゴリ |  |

データはカテゴリ単位で取得する．
