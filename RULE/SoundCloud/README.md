# SoundCloud 分流规则集指南
<details>
<summary>▶ 1. 理解 SoundCloud 流量以实现分流</summary>

<details>
<summary>▶ 1.1. SoundCloud 分流简介</summary>

虚拟专用网络 (VPN) 分流是一种网络配置技术，它允许用户选择性地决定哪些互联网流量通过 VPN 加密隧道传输，哪些流量直接连接到互联网 <sup>1</sup>。这种精细化的流量控制对于优化特定应用程序（如 SoundCloud）的性能和体验至关重要。

针对 SoundCloud 使用分流的主要优势包括：
* **性能优化**： 如果 VPN 服务器引入额外延迟，将 SoundCloud 的流媒体流量直接路由到互联网可以减少延迟，提升播放的流畅性 <sup>1</sup>。
* **带宽节省**： 并非所有流量都通过 VPN 传输，可以有效节省 VPN 的带宽消耗 <sup>1</sup>。
* **访问本地服务**： 用户可以在使用 VPN 访问其他受限服务的同时，让 SoundCloud 使用本地网络连接，反之亦然。
* **谨慎绕过地理限制**： 如果使用 VPN 访问特定地区的 SoundCloud 内容，确保所有必要的 SoundCloud 流量都通过隧道至关重要。代理服务器等相关技术也被用于绕过 SoundCloud 的地理限制 <sup>2</sup>。

然而，配置不当的分流规则也可能带来潜在风险，例如 IP 地址泄露，从而损害用户隐私 <sup>1</sup>。因此，准确识别并配置 SoundCloud 的相关网络端点是实现有效且安全分流的关键。
</details>

<details>
<summary>▶ 1.2. SoundCloud 服务架构概述</summary>

SoundCloud 并非一个单一的整体服务，其架构具有分布式特性。它包含主网站、移动访问点、复杂的 API 后端、广泛用于媒体传输的内容分发网络 (CDN)，以及各种第三方集成服务。

其关键组成部分包括：
* Web 和移动前端界面。
* 用户身份验证服务。
* 用于应用程序逻辑和数据交互的 API 服务。
* 用于传输音频和静态资源的内容分发网络 (CDN)。
* 用于支付、分析、广告和客户支持的第三方服务。

SoundCloud 服务的分布式特性，体现在其拥有众多 `api-*.soundcloud.com` 子域名 <sup>4</sup> 以及对外部 CDN (如 `sndcdn.com` 和 `*.cloudfront.net`) 的依赖 <sup>5</sup>。这意味着一个简单的单域名规则不足以实现全面的分流。例如，SoundCloud 的漏洞赏金计划中列出了大量的 `api-*.soundcloud.com` 域名，如果所有 API 流量都流向单一的 `api.soundcloud.com`，则无需如此详细地列举。这有力地表明 SoundCloud 可能采用了微服务架构，不同的 API 功能（如播放、移动端特定功能、合作伙伴集成）由不同的端点处理。同样，对 `sndcdn.com` 和 `*.cloudfront.net` 的使用也表明内容并非仅从 `soundcloud.com` 提供。因此，一个稳健的分流设置必须考虑到这种分布式架构，以确保 SoundCloud 体验的各个部分都能被正确路由。
</details>
</details>

<details>
<summary>▶ 2. SoundCloud 核心功能所必需的域名</summary>

<details>
<summary>▶ 2.1. 主要网站和移动访问域名</summary>

以下是用户直接与之交互的主要 SoundCloud 域名：
* `soundcloud.com`: SoundCloud 的主域名，是服务的核心入口 <sup>7</sup>。
* `www.soundcloud.com`: `soundcloud.com` 的规范 www 版本，通常用户通过此地址访问 <sup>8</sup>。
* `m.soundcloud.com` / `mobi.soundcloud.com`: 针对移动设备优化的版本，提供更佳的移动浏览体验 <sup>4</sup>。

这些域名是 SoundCloud 服务的基础。例如，SoundCloud 官方强调在 `www.soundcloud.com` 上登录以确保账户安全 <sup>7</sup>。用户也可能将个人域名重定向到其 SoundCloud 个人资料页面，最终指向这些核心域名 <sup>9</sup>。漏洞赏金计划也将 `m.soundcloud.com` / `mobi.soundcloud.com` 列为测试范围，表明其重要性 <sup>4</sup>。
</details>

<details>
<summary>▶ 2.2. 认证和授权端点</summary>

用户账户的认证和授权是访问 SoundCloud 个性化内容和功能的前提。以下域名在此过程中扮演关键角色：
* `secure.soundcloud.com`: 此域名对于所有认证相关的活动至关重要，包括 OAuth 授权流程、用户登录和密码重置 <sup>4</sup>。SoundCloud 的开发者文档详细说明了如何使用 `https://secure.soundcloud.com/authorize` 和 `https://secure.soundcloud.com/oauth/token` 进行 OAuth 2.1 授权 <sup>11</sup>。同时，SoundCloud 的安全提示也间接证实了 `secure.soundcloud.com` 在安全登录中的作用 <sup>7</sup>。其漏洞赏金计划也明确指出此域名用于跨设备登录和密码重置流程 <sup>4</sup>。
* `api-auth.soundcloud.com`: 此域名很可能参与 API 相关的认证过程，确保应用程序接口调用的合法性 <sup>4</sup>。在一些用户维护的功能性白名单中，此域名被列为 SoundCloud 正常运行所需的一部分 <sup>5</sup>。

如果这些认证域名未能根据用户的分流意图（例如，全部通过 VPN 或全部直接连接）进行正确路由，登录和授权过程将失败，导致用户无法访问服务。SoundCloud 的 API 文档 <sup>11</sup> 和漏洞赏金计划范围 <sup>4</sup> 都证实了 `secure.soundcloud.com` 和 `api-auth.soundcloud.com` 的关键性。未能正确路由这些域名将导致认证握手无法完成，从而阻止访问任何用户特定的内容或功能。
</details>

<details>
<summary>▶ 2.3. 核心 API 端点</summary>

API (应用程序编程接口) 端点是 SoundCloud 应用程序获取数据、执行操作和实现各种功能的神经中枢。
* `api.soundcloud.com`: 这是 SoundCloud 主要的公共 API 端点，用于访问如曲目、播放列表、用户信息等资源 <sup>4</sup>。
* `api-v2.soundcloud.com`: 这是一个关键的 API 端点，可能用于较新的或核心的功能模块 <sup>4</sup>。它也被包含在确保 SoundCloud 功能正常的白名单中 <sup>5</sup>。
* 其他 `api-*.soundcloud.com` 变体：SoundCloud 的漏洞赏金计划范围中还指出了多个其他特定功能的 API 子域名 <sup>4</sup>，包括：
    * `api-curators.soundcloud.com`
    * `api-deck.soundcloud.com`
    * `api-fortune.soundcloud.com`
    * `api-mobile-creators.soundcloud.com`
    * `api-mobile.soundcloud.com`
    * `api-mobi.soundcloud.com`
    * `api-partners.soundcloud.com`
    * `api-playback.soundcloud.com`
    * `api-pss.soundcloud.com`
    * `api-widget.soundcloud.com`
* `graph.soundcloud.com`: 此域名可能与 SoundCloud 的社交图谱功能或用户间的数据关系有关 <sup>8</sup>。

这些 API 端点处理从获取曲目信息、用户资料、播放列表到实现播放和用户互动等所有事务。`api-*.soundcloud.com` 子域名的广泛列表强烈暗示了 SoundCloud 采用了微服务架构，每个子域名可能服务于 SoundCloud 功能的不同部分。例如，`api-mobile.soundcloud.com` 可能专门处理移动应用的交互，而 `api-playback.soundcloud.com` 可能负责流媒体播放逻辑。对于分流而言，这意味着需要使用通配符如 `*.api.soundcloud.com` (如果 VPN 客户端支持且足够精确) 或列出这些已知的变体。遗漏任何一个都可能导致特定功能的损坏。

下表总结了 SoundCloud 核心服务所必需的关键域名：

**表 1：SoundCloud 核心服务关键域名**
| 域名                             | 目的/功能                                | 参考资料 | 推荐等级        |
| :------------------------------- | :--------------------------------------- | :------- | :-------------- |
| `soundcloud.com`                 | 主网站                                   | 7        | 必需 - 包含     |
| `www.soundcloud.com`             | 主网站 (www 版本)                        | 8        | 必需 - 包含     |
| `m.soundcloud.com`               | 移动版网站                               | 4        | 必需 - 包含     |
| `mobi.soundcloud.com`            | 移动版网站 (别名)                        | 4        | 必需 - 包含     |
| `secure.soundcloud.com`          | 认证、OAuth、登录、密码重置              | 4        | 必需 - 包含     |
| `api-auth.soundcloud.com`        | API 认证                                 | 4        | 必需 - 包含     |
| `api.soundcloud.com`             | 主要公共 API                             | 4        | 必需 - 包含     |
| `api-v2.soundcloud.com`          | 核心 API (版本2)                         | 4        | 必需 - 包含     |
| `api-curators.soundcloud.com`    | 特定 API (策展人)                        | 4        | 推荐 - 包含     |
| `api-deck.soundcloud.com`        | 特定 API (Deck)                          | 4        | 推荐 - 包含     |
| `api-fortune.soundcloud.com`     | 特定 API (Fortune)                       | 4        | 推荐 - 包含     |
| `api-mobile-creators.soundcloud.com` | 特定 API (移动创作者)                    | 4        | 推荐 - 包含     |
| `api-mobile.soundcloud.com`      | 特定 API (移动)                          | 4        | 推荐 - 包含     |
| `api-mobi.soundcloud.com`        | 特定 API (移动别名)                      | 4        | 推荐 - 包含     |
| `api-partners.soundcloud.com`    | 特定 API (合作伙伴)                      | 4        | 推荐 - 包含     |
| `api-playback.soundcloud.com`    | 特定 API (播放)                          | 4        | 推荐 - 包含     |
| `api-pss.soundcloud.com`         | 特定 API (PSS)                           | 4        | 推荐 - 包含     |
| `api-widget.soundcloud.com`      | 特定 API (小部件)                        | 4        | 推荐 - 包含     |
| `graph.soundcloud.com`           | 社交图谱/数据关系 API                    | 8        | 推荐 - 包含     |
</details>
</details>

<details>
<summary>▶ 3. 内容分发网络 (CDN) 域名</summary>

内容分发网络 (CDN) 对于 SoundCloud 提供流畅的音频流和快速的资源加载至关重要。CDN 将内容缓存到地理上更接近用户的服务器，从而显著减少延迟 <sup>12</sup>。

<details>
<summary>▶ 3.1. SoundCloud 自有 CDN 基础设施 (`sndcdn.com`)</summary>

SoundCloud 运营着自己的 CDN 相关域名：
* `sndcdn.com`: 这是 SoundCloud CDN 的一个主要域名 <sup>6</sup>。
* `*.sndcdn.com`: 使用通配符可以覆盖其下各种提供具体服务的子域名。

一些具体的 `sndcdn.com` 子域名在用户维护的白名单中被证实为功能所必需 <sup>5</sup>，例如：
* `a-v2.sndcdn.com` (可能用于音频内容)
* `cf-hls-media.sndcdn.com` (用于 HLS 流媒体)
* `cf-hls-opus-media.sndcdn.com` (用于 HLS Opus 编码的流媒体)

这些域名对于传输音频流和其他媒体资源至关重要。
</details>

<details>
<summary>▶ 3.2. 第三方 CDN 使用 (例如 Amazon CloudFront)</summary>

除了自有 CDN 设施，SoundCloud 还广泛利用第三方 CDN 服务，特别是 Amazon CloudFront：
* `*.cloudfront.net`: 这是一个通用的 Amazon CloudFront 域名模式。SoundCloud 利用此 CDN 服务在全球范围内部署内容。

多个特定的 `cloudfront.net` 子域名被用户确认为 SoundCloud 正常运作所需 <sup>5</sup>，包括：
* `d15wdfb2rw9n2y.cloudfront.net`
* `d1hcxlifzhxzha.cloudfront.net`
* `d1ws1c3tu8ejje.cloudfront.net`
* `d2gff659so2qub.cloudfront.net`
* `d36lkcxq7qra7v.cloudfront.net`
* `dezyktpp25vy8.cloudfront.net`

Netify.ai 的分析也证实了 SoundCloud 对 Amazon CloudFront 的大量使用，并列出了其众多的接入点 (PoPs) <sup>6</sup>。
</details>

<details>
<summary>▶ 3.3. 其他资产和云域名</summary>

除了主要的流媒体 CDN，还有一些域名用于托管网站的静态资产和云资源：
* `assets.web.soundcloud.cloud`: 此域名可能用于提供 SoundCloud 网站所需的静态 Web 资产，如 CSS、JavaScript 和图片 <sup>5</sup>。
* `soundcloud.cloud`: 可能作为 SoundCloud 云基础设施的通用域名 <sup>8</sup>。

CDN 域名对于实际的音频流媒体播放是绝对关键的。如果这些域名在分流配置中设置错误，用户可能能够浏览 SoundCloud 网站，但无法播放曲目，或者播放质量会严重下降。用户生成的白名单 <sup>5</sup> 中包含了大量的 `sndcdn.com` 和 `cloudfront.net` 域名，这从实践上证明了它们的重要性。如果 SoundCloud 的音频内容托管在这些 CDN 上，而分流规则未能将流量正确导向它们，客户端将无法获取媒体数据，导致播放失败或频繁缓冲。SoundCloud 的漏洞赏金计划范围也暗示了指向 AWS (CloudFront 是其一部分) 的域名是相关的 <sup>13</sup>。因此，仅仅将 `*.soundcloud.com` 加入规则列表是不足以保证完整功能的。

下表列出了对 SoundCloud 内容传输至关重要的 CDN 域名：

**表 2：SoundCloud 内容分发网络 (CDN) 域名**
| 域名/模式                        | CDN 提供商        | 目的                                  | 参考资料 | 推荐等级        |
| :------------------------------- | :---------------- | :------------------------------------ | :------- | :-------------- |
| `*.sndcdn.com`                   | SoundCloud        | 音频流、媒体资源                      | 5        | 必需 - 包含     |
| `a-v2.sndcdn.com`                | SoundCloud        | 音频内容                              | 5        | 必需 - 包含     |
| `cf-hls-media.sndcdn.com`        | SoundCloud        | HLS 流媒体                            | 5        | 必需 - 包含     |
| `cf-hls-opus-media.sndcdn.com`   | SoundCloud        | HLS Opus 流媒体                       | 5        | 必需 - 包含     |
| `*.cloudfront.net`               | Amazon CloudFront | 音频流、媒体资源、静态资产            | 5        | 必需 - 包含     |
| `d15wdfb2rw9n2y.cloudfront.net`  | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `d1hcxlifzhxzha.cloudfront.net`  | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `d1ws1c3tu8ejje.cloudfront.net`  | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `d2gff659so2qub.cloudfront.net`  | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `d36lkcxq7qra7v.cloudfront.net`  | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `dezyktpp25vy8.cloudfront.net`   | Amazon CloudFront | CDN 内容                              | 5        | 必需 - 包含     |
| `assets.web.soundcloud.cloud`    | SoundCloud        | 静态 Web 资产                         | 5        | 必需 - 包含     |
| `soundcloud.cloud`               | SoundCloud        | 通用云基础设施                        | 8        | 推荐 - 包含     |
</details>
</details>

<details>
<summary>▶ 4. 支持服务域名</summary>

除了核心功能和内容传输，SoundCloud 还依赖一系列支持服务域名来实现嵌入式播放、分析、广告以及用户体验增强等功能。

<details>
<summary>▶ 4.1. 嵌入式播放器和小部件</summary>

* `w.soundcloud.com`: 这是 SoundCloud 官方提供的可嵌入播放器小部件的域名 <sup>4</sup>。开发者文档中提供了其 API 和 iframe 播放器源地址，格式为 `https://w.soundcloud.com/player/...` <sup>14</sup>。
* `connect.soundcloud.com`: 此域名用于 SoundCloud 的 JavaScript SDK，它使得第三方网站和应用能够集成 SoundCloud 功能，如流媒体播放和文件上传 <sup>15</sup>。SDK 脚本通常托管在类似 `https://connect.soundcloud.com/sdk/sdk-3.3.2.js` 的地址。

如果用户需要在其他网站上与嵌入的 SoundCloud 内容互动，或使用基于 SoundCloud SDK 构建的第三方应用，这些域名是必不可少的。
</details>

<details>
<summary>▶ 4.2. 分析和用户体验 (用户酌情决定)</summary>

这些服务帮助 SoundCloud 了解用户行为、管理 Cookie 同意并提供技术支持。用户需要根据自己的需求决定是否将这些流量与主要 SoundCloud 流量一同路由。
* `events-api.soundcloud.com`: 虽然有资料提及此域名可能与广告有关，但它也可能用于通用的事件跟踪或分析 <sup>5</sup>。
* `dwt.soundcloud.com`: 具体用途未明确说明，但有分析认为它可能与数据仓库或用户行为追踪有关 <sup>8</sup>。
* **Google Analytics (谷歌分析)**: SoundCloud 很可能使用谷歌分析。标准的谷歌分析域名包括 `www.google-analytics.com`, `ssl.google-analytics.com`, `analytics.google.com` <sup>16</sup>。
* **OneTrust**: 用于 Cookie 同意管理，相关域名可能包括 `*.onetrust.com` 和 `cdn.cookielaw.org` <sup>6</sup>。
* **Zendesk**: 用于提供帮助和客户支持小部件，相关域名包括 `*.zendesk.com` 和 `static.zdassets.com` <sup>6</sup>。
</details>

<details>
<summary>▶ 4.3. 广告域名 (用户酌情决定排除或包含)</summary>

以下域名被明确识别为广告服务相关：
* `soundcloud.deliveryengine.adswizz.com` <sup>5</sup>
* `zc.adswizz.com` <sup>5</sup>
* `googleads.g.doubleclick.net` <sup>5</sup>

希望通过分流实现广告屏蔽的用户可能希望将这些域名路由到主 SoundCloud 隧道之外，或者如果其 VPN/防火墙允许，则完全阻止它们。

将 SoundCloud 的服务区分为核心必要服务与可选的追踪/广告服务，对于用户实现个性化配置至关重要。例如，有用户报告明确区分了功能性域名和广告域名 <sup>5</sup>。同时，分析报告也列出了 SoundCloud 使用的第三方 SaaS 平台，如 OneTrust 和 Zendesk <sup>6</sup>，这些平台并非用于音乐流媒体，而是用于网站的辅助功能（如同意管理、客户支持）。用户的分流目标（例如，仅仅确保音乐播放，还是希望包括聊天支持在内的整个网站体验都遵循相同的路由路径）将决定是否包含这些域名。如果目标是避免广告，那么这些广告域名 <sup>5</sup> 将是理想的从“SoundCloud”隧道中排除的候选对象。

下表列出了 SoundCloud 的支持服务及部分第三方服务域名，供用户参考：

**表 3：SoundCloud 支持及第三方服务域名**
| 域名                                  | 服务类型           | 提供商                  | 参考资料 | 推荐等级（说明）                                                 |
| :------------------------------------ | :----------------- | :---------------------- | :------- | :--------------------------------------------------------------- |
| `w.soundcloud.com`                    | 嵌入式播放器       | SoundCloud              | 4        | 酌情 - 若需嵌入播放功能则包含                                      |
| `connect.soundcloud.com`              | JavaScript SDK     | SoundCloud              | 15       | 酌情 - 若使用依赖 SDK 的应用则包含                                 |
| `events-api.soundcloud.com`           | 事件追踪/分析      | SoundCloud              | 5        | 酌情 - 可能影响统计或部分功能，可尝试排除                          |
| `dwt.soundcloud.com`                  | 数据追踪/分析      | SoundCloud              | 8        | 酌情 - 具体影响未知，可尝试排除                                    |
| `www.google-analytics.com`            | 网站分析           | Google                  | 6        | 酌情 - 排除不影响核心功能，但 SoundCloud 可能无法统计                |
| `ssl.google-analytics.com`            | 网站分析 (安全)    | Google                  | 6        | 酌情 - 同上                                                      |
| `analytics.google.com`                | 网站分析           | Google                  | 6        | 酌情 - 同上                                                      |
| `*.onetrust.com`                      | Cookie 同意管理    | OneTrust                | 6        | 酌情 - 排除可能导致重复出现 Cookie 同意弹窗                        |
| `cdn.cookielaw.org`                   | Cookie 同意管理    | OneTrust (Content Delivery) | 19       | 酌情 - 同上                                                      |
| `*.zendesk.com`                       | 客户支持平台       | Zendesk                 | 6        | 酌情 - 排除可能导致应用内帮助/支持功能无法使用                     |
| `static.zdassets.com`                 | 客户支持资源       | Zendesk (Content Delivery) | 21       | 酌情 - 同上                                                      |
| `soundcloud.deliveryengine.adswizz.com` | 广告服务           | Adswizz                 | 5        | 酌情 - 排除可屏蔽部分广告，不影响核心播放                          |
| `zc.adswizz.com`                      | 广告服务           | Adswizz                 | 5        | 酌情 - 同上                                                      |
| `googleads.g.doubleclick.net`         | 广告服务           | Google                  | 5        | 酌情 - 同上                                                      |
</details>
</details>

<details>
<summary>▶ 5. SoundCloud IP 地址范围 (供高级配置参考)</summary>

虽然基于域名的规则通常更可靠且易于维护，但在某些高级配置场景下，了解 SoundCloud 的 IP 地址范围可能有所帮助。

<details>
<summary>▶ 5.1. SoundCloud 的 ASN 和主要 IP 地址块</summary>

SoundCloud 主要通过自治系统号 (ASN) AS197157 进行管理 <sup>6</sup>。与其相关的主要 IP 地址块包括：

* **IPv4 地址范围**:
    * `178.249.136.0/22` (包含 1,024 个 IP 地址) <sup>6</sup>
    * `178.249.142.0/23` (包含 512 个 IP 地址) <sup>22</sup>
    * 一个更广泛的范围 `178.249.136.0/21` (包含 2,048 个 IP 地址) 也被提及，它涵盖了上述两个范围 <sup>23</sup>。
* **IPv6 地址范围**:
    * `2a02:13d8::/32` <sup>22</sup>

此外，有资料显示 `soundcloudmail.com` 域名托管在 `178.249.139.81` 和 `178.249.139.17` 这两个 IP 地址上，它们也属于 AS197157 的范围 <sup>23</sup>。
</details>

<details>
<summary>▶ 5.2. 使用基于 IP 规则的注意事项</summary>

强烈建议优先使用基于域名的分流规则，原因如下：
* **动态性**： IP 地址，尤其是在云环境中（SoundCloud 使用 AWS、GCP 等云服务 <sup>4</sup>），可能会发生变化。云服务提供商为了灵活性和负载均衡，经常会动态分配 IP 地址。
* **共享 IP**： CDN 和大型云提供商可能会在相同的 IP 地址上托管多个客户的服务。因此，基于 IP 的规则可能会过于宽泛，意外地包含非 SoundCloud 的流量。
* **维护难度**： IP 地址的变动比域名更频繁，这意味着基于 IP 的规则需要更频繁的审查和更新。

基于 IP 的规则应仅在基于域名的规则不足以满足需求或 VPN 客户端不支持域名规则的极端情况下考虑，并且用户需要有心理准备进行更频繁的维护。SoundCloud 大量利用云基础设施和 CDN <sup>6</sup>，这些平台的 IP 地址具有动态性。今天为 SoundCloud 提供服务的 IP 地址明天可能服务于其他应用，或者 SoundCloud 可能将其服务迁移到新的 IP 地址而无需通知。因此，依赖这些 IP 地址进行分流是脆弱的。域名提供了一个更稳定的抽象层。
</details>
</details>

<details>
<summary>▶ 6. SoundCloud 分流规则集整合建议</summary>

基于以上分析，本节提供一个整合的 SoundCloud 分流规则集建议，旨在实现全面的 SoundCloud 服务访问。

<details>
<summary>▶ 6.1. 全面访问的推荐域名列表</summary>

以下列表结合了核心服务、API 和 CDN 的关键域名，是实现 SoundCloud 大部分功能所必需的。
* `soundcloud.com`
* `www.soundcloud.com`
* `m.soundcloud.com`
* `secure.soundcloud.com`
* `api.soundcloud.com`
* `api-v2.soundcloud.com`
* `api-auth.soundcloud.com`
* `api-curators.soundcloud.com`
* `api-deck.soundcloud.com`
* `api-fortune.soundcloud.com`
* `api-mobile-creators.soundcloud.com`
* `api-mobile.soundcloud.com`
* `api-mobi.soundcloud.com`
* `api-partners.soundcloud.com`
* `api-playback.soundcloud.com`
* `api-pss.soundcloud.com`
* `api-widget.soundcloud.com`
* `graph.soundcloud.com`
* `*.sndcdn.com` (或 表 2 中列出的具体子域名，如果通配符导致问题)
* `d15wdfb2rw9n2y.cloudfront.net`
* `d1hcxlifzhxzha.cloudfront.net`
* `d1ws1c3tu8ejje.cloudfront.net`
* `d2gff659so2qub.cloudfront.net`
* `d36lkcxq7qra7v.cloudfront.net`
* `dezyktpp25vy8.cloudfront.net` (如果需要更广泛的 CDN 覆盖，可考虑 `*.cloudfront.net`，但需注意其潜在的广泛性)
* `assets.web.soundcloud.cloud`
* `soundcloud.cloud`
* `w.soundcloud.com`
* `connect.soundcloud.com`
</details>

<details>
<summary>▶ 6.2. 通配符 (*) 的使用</summary>

在域名规则中使用通配符 (*) 可以匹配指定域名下的所有子域名。
* **优势**： 可以简化规则集，用一条规则覆盖多个子域名。例如，`*.sndcdn.com` 可以匹配所有 `sndcdn.com` 的子域名。
* **风险**： 如果使用不当，通配符可能过于宽泛，包含不必要的流量。例如，`*.soundcloud.com` 会包含 `blog.soundcloud.com`, `status.soundcloud.com` 等，这些在 SoundCloud 的漏洞赏金计划中被明确列为范围之外 <sup>13</sup>，用户可能不希望将这些非核心服务的流量也纳入隧道。
* **建议**： 在已知关键子域名的情况下，优先使用具体的子域名。如果需要使用通配符，应尽量使用目标更明确的通配符，例如 `api-*.soundcloud.com` (如果 VPN 客户端支持此类模式)，而不是过于宽泛的通配符如 `*.com`。SoundCloud 的漏洞赏金计划的范围外列表 <sup>13</sup> 对于判断哪些 `soundcloud.com` 子域名属于非核心或由第三方管理（例如 `help.soundcloud.com` 很可能指向 Zendesk）非常有帮助。这有助于优化通配符的使用，避免将不必要的服务也纳入分流规则。如果用户使用简单的 `*.soundcloud.com` 规则，所有这些非核心服务都将被包含在分流隧道中，这可能并非用户的初衷，并且可能不必要地消耗 VPN 带宽或使这些次要服务受到 VPN 网络特性的影响。因此，采用更精细的方法，以漏洞赏金计划范围内的列表 <sup>13</sup> 作为必要 `soundcloud.com` 子域名的指南，通常优于使用过于笼统的通配符。

下表为推荐的 SoundCloud 分流核心域名列表：

**表 4：SoundCloud 分流核心域名推荐列表**
| 域名/通配符                     | 类别                   | 优先级         | 备注                                        |
| :------------------------------ | :--------------------- | :------------- | :------------------------------------------ |
| `soundcloud.com`                | 核心                   | 必需           | 主网站                                      |
| `www.soundcloud.com`            | 核心                   | 必需           | 主网站 (www 版本)                             |
| `m.soundcloud.com`              | 核心                   | 必需           | 移动版网站                                  |
| `secure.soundcloud.com`         | 核心 (认证)            | 必需           | 用户认证和安全                              |
| `api.soundcloud.com`            | API                    | 必需           | 主要 API 接口                               |
| `api-v2.soundcloud.com`         | API                    | 必需           | 核心 API (版本2)                            |
| `api-auth.soundcloud.com`       | API (认证)             | 必需           | API 认证                                    |
| `api-playback.soundcloud.com`   | API (播放)             | 必需           | 播放相关 API                                |
| `api-mobile.soundcloud.com`     | API (移动)             | 高度推荐       | 移动应用 API                                |
| (其他 `api-*.soundcloud.com` 变体) | API                    | 高度推荐       | 覆盖其他特定功能 API                        |
| `*.sndcdn.com`                  | CDN                    | 必需           | SoundCloud 自有 CDN，关键音频和媒体传输       |
| (表 2 中列出的 `*.cloudfront.net` 域名) | CDN                    | 必需           | Amazon CloudFront CDN，关键音频和媒体传输     |
| `assets.web.soundcloud.cloud`   | CDN/静态资源           | 必需           | 网站静态资源                                |
| `w.soundcloud.com`              | 支持服务 (嵌入式播放)  | 高度推荐       | 嵌入式播放器功能                            |
| `connect.soundcloud.com`        | 支持服务 (SDK)         | 高度推荐       | JavaScript SDK 功能                         |
</details>
</details>

<details>
<summary>▶ 7. 其他 SoundCloud 相关服务的考量</summary>

除了核心的收听和浏览功能，SoundCloud 还涉及支付、客户支持等其他服务，这些服务可能依赖额外的域名。

<details>
<summary>▶ 7.1. 支付处理</summary>

* `checkout.soundcloud.com`: 这是 SoundCloud 用于处理 Go 等订阅服务的支付站点前端 <sup>4</sup>。
* 后端处理器：
    * SoundCloud 使用 Adyen 作为其支付处理服务商之一 <sup>24</sup>。在支付过程中，可能涉及以下 Adyen 相关域名：
        * `out.adyen.com` (用于处理 Webhook 通知) <sup>27</sup>
        * `[随机字符串]-[公司名]-pal-live.adyenpayments.com` (商家特定的 Adyen Live 端点格式) <sup>28</sup>
    * 在支付 iframe 或重定向流程中可能还会遇到其他 Adyen 域名。

如果用户需要在其 SoundCloud 流量被特定路由（例如通过 VPN）的同时管理订阅或进行支付，这些域名可能需要被包含在分流规则中。
</details>

<details>
<summary>▶ 7.2. 客户支持平台</summary>

* `help.soundcloud.com`: 此域名在 SoundCloud 的漏洞赏金计划中被列为范围之外 <sup>13</sup>，这通常意味着它可能由第三方服务托管，例如 Zendesk。
* **Zendesk 域名**： 如果 `help.soundcloud.com` 确实由 Zendesk 提供支持，那么相关的 Zendesk 域名可能包括 `*.zendesk.com` 和 `static.zdassets.com` <sup>6</sup>。

为了在 SoundCloud 应用内或网站上访问帮助文章或使用支持小部件，这些域名可能是必需的。
</details>

<details>
<summary>▶ 7.3. Cookie 同意管理</summary>

* **OneTrust 域名**： SoundCloud 使用 OneTrust 进行 Cookie 同意管理 <sup>6</sup>。相关域名包括 `*.onetrust.com` 和 `cdn.cookielaw.org` <sup>18</sup>。

为了确保 Cookie 同意横幅和偏好设置管理功能在隧道连接体验中正常工作，可能需要包含这些域名。
</details>

<details>
<summary>▶ 7.4. 其他 SoundCloud 资产 (通常在核心功能规则范围之外)</summary>

* `*.soundcloud.org`: 在漏洞赏金计划中被列为范围内 <sup>13</sup>，但其具体用途可能较为特定，例如用于非营利活动或社区方面。
* `*.s-cloud.net`: 同样在漏洞赏金计划范围内 <sup>4</sup>，被描述为“运行一些私有服务”，可能主要用于后端或内部服务，用户客户端通常不需要直接路由到这些域名。
* `artists.soundcloud.com`: 漏洞赏金计划范围内，专为艺术家提供的门户网站 <sup>13</sup>。
* `soundcloud.app.goo.gl`: 很可能用于深度链接或移动应用的集成 <sup>6</sup>。
* **漏洞赏金计划范围外域名**： 例如 `blog.soundcloud.com`, `status.soundcloud.com`, `press.soundcloud.com`, `jobs.soundcloud.com`, `promote.soundcloud.com` <sup>13</sup>。
* `playback.soundcloud.com`: 用于展示年度回顾类的“Your Playback”功能，而非直接的流媒体播放 <sup>29</sup>。

这些域名服务于从艺术家特定门户到信息性网站等多种目的。用户应考虑是否需要将这些域名与核心 SoundCloud 体验一起路由。SoundCloud 的漏洞赏金计划的“范围内”与“范围外”列表 <sup>13</sup> 对于判断 SoundCloud 自身认为哪些是其核心、受保护的平台，哪些是辅助或第三方托管的服务非常有价值。例如，`checkout.soundcloud.com` 在范围内，表明它是 SoundCloud 管理的支付前端。然而，实际的支付处理会涉及像 Adyen 这样的第三方域名 <sup>24</sup>。`help.soundcloud.com` 在范围外，强烈暗示它是一个 SaaS 解决方案，如 Zendesk <sup>6</sup>。这种区分至关重要：如果用户只想让 SoundCloud 拥有的基础设施通过其隧道，他们会排除 Zendesk。如果他们希望帮助系统在该隧道体验中无缝工作，则需要添加 Zendesk 域名。

下表总结了这些可选和辅助服务域名：

**表 5：SoundCloud 可选及辅助服务域名**
| 域名                                     | 服务类型                  | 提供商                                  | 参考资料        | 推荐等级（说明）                                                     |
| :--------------------------------------- | :------------------------ | :-------------------------------------- | :-------------- | :------------------------------------------------------------------- |
| `checkout.soundcloud.com`                | 支付前端                  | SoundCloud                              | 4               | 酌情 - 若需在隧道内管理订阅/支付则包含                               |
| `out.adyen.com`                          | 支付处理器 (Webhook)    | Adyen                                   | 27              | 酌情 - 支付功能可能需要                                              |
| `[prefix]-pal-live.adyenpayments.com`    | 支付处理器                | Adyen                                   | 28              | 酌情 - 支付功能可能需要，前缀需具体确定                              |
| `help.soundcloud.com`                    | 客户支持                  | SoundCloud (可能由 Zendesk 托管)        | 13              | 酌情 - 若需隧道内支持功能，可能需包含 Zendesk 域名                     |
| `*.zendesk.com`                          | 客户支持平台              | Zendesk                                 | 6               | 酌情 - 若 `help.soundcloud.com` 由 Zendesk 托管则考虑包含                |
| `static.zdassets.com`                    | 客户支持资源              | Zendesk                                 | 21              | 酌情 - 同上                                                          |
| `*.onetrust.com`                         | Cookie 同意管理           | OneTrust                                | 6               | 酌情 - 确保 Cookie 同意功能正常                                      |
| `cdn.cookielaw.org`                      | Cookie 同意管理           | OneTrust                                | 19              | 酌情 - 同上                                                          |
| `artists.soundcloud.com`                 | 艺术家门户                | SoundCloud                              | 13              | 酌情 - 艺术家用户可能需要                                            |
| `*.soundcloud.org`                       | 其他 SoundCloud 资产      | SoundCloud                              | 13              | 酌情 - 通常非核心收听功能所需                                        |
| `*.s-cloud.net`                          | 其他 SoundCloud 资产      | SoundCloud                              | 4               | 酌情 - 通常为后端服务，客户端无需直接路由                            |
| `soundcloud.app.goo.gl`                  | 移动应用集成              | Google (Firebase Dynamic Links)         | 6               | 酌情 - 可能影响移动应用内链接跳转                                    |
| `playback.soundcloud.com`                | 年度回顾功能              | SoundCloud                              | [13 (范围外), 29] | 酌情 - 非核心播放功能                                                |
| (其他 `*.soundcloud.com` 范围外域名)      | 信息性/辅助               | SoundCloud                              | 13              | 通常排除 - 非核心功能，除非有特定需求                                |
</details>
</details>

<details>
<summary>▶ 8. 实施说明和最佳实践</summary>

<details>
<summary>▶ 8.1. 在 VPN 客户端中应用规则</summary>

具体的规则应用方法取决于所使用的 VPN 客户端软件。大多数现代 VPN 客户端都支持某种形式的分流，无论是基于应用程序还是基于域名/IP 地址 <sup>1</sup>。用户应查阅其 VPN 客户端的官方文档以获取详细的配置步骤。

在配置规则时，如果 VPN 客户端支持规则排序，通常建议将更具体的规则置于更宽泛的规则之前，以确保流量被正确匹配。
</details>

<details>
<summary>▶ 8.2. 定期更新的重要性</summary>

互联网服务的架构并非一成不变。SoundCloud 的基础设施，包括其使用的域名和 IP 地址，都可能随着时间的推移而发生变化（例如，添加新的 API 端点、更换 CDN 提供商或整合新的第三方服务）。因此，今天创建的分流规则集可能在未来变得不完整或不准确。

建议用户定期审查和更新其分流规则集，尤其是在遇到连接或功能问题时。关注 SoundCloud 的开发者页面、官方博客或相关的技术社区，可能会获取到关于其网络架构变更的信息。
</details>

<details>
<summary>▶ 8.3. 测试和验证</summary>

在应用分流规则后，进行彻底的测试至关重要，以确保 SoundCloud 的各项功能均按预期工作。测试应包括但不限于：
* 用户登录和注销。
* 搜索曲目、艺术家和播放列表。
* 流畅播放音频流。
* 点赞、评论和转发等互动功能。
* 访问用户设置和个人资料。
* 如果使用了嵌入式播放器，测试其功能。

如果遇到问题，可以使用浏览器的开发者工具（特别是网络选项卡）或专业的网络抓包工具（如 Wireshark，需具备相关知识并谨慎使用）来检查流量的实际路由情况，判断是否符合分流规则的预期。
</details>

<details>
<summary>▶ 8.4. DNS 注意事项</summary>

DNS (域名系统) 解析在分流配置中也扮演着重要角色 <sup>31</sup>。错误的 DNS 解析可能导致类似路由问题的现象。用户需要确保系统的 DNS 解析按照预期进行——无论是通过 VPN 服务器提供的 DNS，还是通过本地网络配置的 DNS，这取决于具体的分流设置和 VPN 客户端的行为。

对于高级用户在排查问题或扩展规则集时，SoundCloud 漏洞赏金计划中提到的一个有用建议是：对目标域名运行 DNS 查询（例如使用 `dig` 或 `nslookup` 命令），检查其 CNAME 记录 <sup>4</sup>。这有助于判断一个域名是 SoundCloud 直接拥有和运营，还是指向一个第三方服务。例如，如果 `example.soundcloud.com` 的 CNAME 指向 `service.thirdparty.com`，那么 `service.thirdparty.com` 可能也需要被考虑到分流规则中。

一个静态的规则集只是一个特定时间点的解决方案。强调维护的必要性并提供故障排除的起点，对于用户的长期满意度至关重要。网络服务会不断发展，SoundCloud 可能会更改 CDN 提供商，将 API 重构到新的子域名，或集成新的第三方工具。因此，向用户提供如何维护其规则（定期审查、检查官方来源）以及如何进行故障排除（测试、基本网络诊断）的建议，比仅仅提供一个列表更具实际价值。
</details>
</details>

<details>
<summary>▶ 9. 结论与建议</summary>

为 SoundCloud 配置有效的 VPN 分流规则集，需要对其复杂的分布式服务架构有清晰的理解。这包括识别核心网站域名、认证端点、众多 API 接口、自有及第三方 CDN 域名，以及各种支持性和可选的第三方服务域名。

核心建议如下：
* **优先使用基于域名的规则**： 鉴于 SoundCloud 广泛使用云服务和 CDN，其 IP 地址可能频繁变动，基于域名的规则具有更好的稳定性和可维护性。
* **包含所有核心和 CDN 域名**： 确保 表 1 和 表 2 中列为“必需”的域名被包含在规则中，这是保证 SoundCloud 基本浏览、认证和音频播放功能的关键。特别是 `secure.soundcloud.com` (认证) 和 `*.sndcdn.com` 及相关的 `*.cloudfront.net` (内容传输) 域名。
* **仔细处理 API 域名**： SoundCloud 拥有众多 `api-*.soundcloud.com` 子域名。理想情况下应全部包含，或使用精确的通配符 (如 `api-*.soundcloud.com`，若支持) 以确保所有功能正常。
* **谨慎使用通配符**： 虽然通配符可以简化规则，但也可能包含不必要的流量。应避免使用过于宽泛的通配符，并参考 SoundCloud 官方信息（如漏洞赏金计划范围）来确定哪些子域名是核心服务。
* **用户酌情处理支持性和第三方服务**： 对于分析、广告、支付、客户支持等域名（如 表 3 和 表 5 所列），用户应根据个人需求（例如，追求纯粹播放体验、需要完整网站功能或希望屏蔽广告）决定是否将其纳入分流规则。
* **定期审查和更新**： SoundCloud 的网络端点可能会发生变化。用户应定期检查并更新其分流规则，以确保其持续有效。
* **彻底测试**： 配置完成后，务必全面测试 SoundCloud 的各项功能，以验证分流规则的正确性。

通过遵循本指南中提供的域名列表和建议，用户可以创建一个强大且适应性强的 SoundCloud 分流规则集，从而根据自身需求优化网络流量路由，提升使用体验。
</details>
