# djs-interactions

discord.jsには各種のInteractionがありますが、
それらの定義とハンドラを近い位置に書けるようにすることで
使いやすくするフレームワーク的何かです。

## 使い方

詳しい使い方は`sample/`を見てください。
基本的には`interactionFrame.Base(<Interactionの種類>)`で得られるクラスを継承して使います。
`<Interactionの種類>`に使えるものは次の通りです。

| Interactionの種類 | 説明 |
| -- | -- |
| `'CHAT_INPUT'` | スラッシュコマンド |
| `'MESSAGE'` | メッセージのContext Menu |
| `'USER'` | ユーザーのContext Menu |
| `'BUTTON'` | ボタン |
| `'SELECT_MENU'` | セレクトメニュー |
| `'MODAL'` | モーダルウィンドウ |

### 最初に定義し登録するもの(上三つ)

`ApplicationCommandData`(スラッシュコマンドとContext Menu)がこれにあたります。
開始時にまとめてインスタンス化(new)して、`registerCommand`で登録します。

### 実行中、都度定義して使用するもの(下三つ)

ボタン、セレクトメニュー、モーダルウィンドウがこれにあたります。
`interactionFrame.Base(<Interactionの種類>)`を継承したクラスを定義しておき、使いたい場所でnewしてdiscord.jsに渡します(この継承元クラスはさらにMessageButtonなどdiscord.jsのクラスを継承しているので、そのまま渡すことができます)。
newしたタイミングで自動的にハンドラが登録され、イベントが発生すると該当のハンドラだけが呼び出されます。

## データベースと連携させる場合

デフォルトではInteractionの定義はメモリに保存されるため、プログラムを終了させた時点で蒸発します。これを防ぐには、データベースなどに保存しておく必要があります(なお、データベースに保存する形式を自由に指定できるようにするため、djs-interactionからは型とクラスを提供するだけになっています)。

1. 各ファイルからインポートできる位置に`adapter.ts`を作成します。

  ```ts
  import { Adapter, DefaultDataStore, StorageObject } from "djs-interaction";

  type StoreType = Record<string, string>;


  // This will be adapter to database in real use cases
  const store = new DefaultDataStore<StorageObject<StoreType>>();

  export const adapter =
      new Adapter<StoreType, DefaultDataStore<StorageObject<StoreType>>>(store)
  ```

1. 適当な箇所(`registerCommand`の直前など)でAdapterを設定します。

  ```ts
  import { adapter } from './adapter'
  //...
  await frame.store.setStore(adapter)
  ```

1. すべてのコマンド定義、コンポーネント定義の直後にserializer/deserializerを記述します。

  ```ts
  adapter.register({
    key: 'more',
    ctor: More,
    serialize(from) {
      return from.serialize()
    },
    deserialize(to) {
      return new More(to.message)
    }
  })
  ```
