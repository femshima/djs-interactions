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
