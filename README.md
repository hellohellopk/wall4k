# WallGen 4K

WallGen 4K 是一個可即時調整幾何與配色、輸出 2160 × 4680 PNG 桌布的 React + Vite 靜態網站。

## 本機執行

```bash
pnpm install
pnpm dev
```

## GitHub Pages 發布

此儲存庫的 Pages 工作流程**只可手動觸發**，因此推送程式碼不會自動公開網站。

請先在 GitHub 儲存庫的 **Settings → Pages** 將來源設為 **GitHub Actions**。接著前往 **Actions → Deploy GitHub Pages → Run workflow** 手動開始發布。GitHub Pages 完成後，網站預期會位於：

```text
https://hellohellopk.github.io/wall4k/
```

> 注意：本儲存庫目前設為私有。若你的 GitHub 方案不支援私有儲存庫使用 Pages，請先改為公開儲存庫，或改用其他靜態託管方式。
