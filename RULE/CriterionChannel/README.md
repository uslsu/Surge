# Criterion Channel 分流规则集构建指南

## I. Criterion Channel 分流规则简介

### A. 分流规则的目的与益处

分流规则 (Shunting Rules / 分流規則) 是网络代理工具中用于根据域名、IP 地址或其他标准选择性路由互联网流量的配置。对于 The Criterion Channel (下称“CC”) 这样的流媒体服务，其主要益处通常在于绕过地理位置限制。CC 的服务主要面向美国和加拿大地区的用户 1。通过将与 CC 相关的流量导向位于授权区域的代理服务器，用户可以访问这些受限内容。

次要益处可能包括优化连接路径以获得更好的流媒体质量，或在使用复杂网络设置时确保特定服务组件（如数字版权管理 (DRM) 或支付系统）正常工作。用户对“分流规则集”的明确要求，表明其具备一定的网络代理工具使用经验和技术理解，其核心动机很可能是为了访问 CC 的地理限制内容。

### B. 本指南概述

本报告旨在提供一份详尽调研的、与 CC 及其底层服务提供商相关的域名列表。目标是为用户提供必要的信息，以便为其偏好的代理工具创建一套有效且全面的分流规则集。此外，报告还将涵盖实施和维护这些规则的重要注意事项。

## II. 核心基础设施：Criterion Channel 与 Vimeo OTT 域名

CC 的顺畅运行依赖于其自身的服务域名以及其视频服务后台 Vimeo OTT 平台的域名。

### A. Criterion Channel 主要域名

以下是 CC 自身运营所必需的核心域名：

- `criterionchannel.com`: 这是 CC 主要的面向公众的网站，用户在此浏览内容、注册和登录 5。它是服务的首要入口。
- `criterion.com`: 这是 CC 母公司 The Criterion Collection 的域名 4。此域名也用于常见问题解答 (FAQ)、客户支持邮件联系 (例如 `channelhelp@criterion.com` 1)、隐私政策 7 及公司信息。它对于与频道相关的辅助功能至关重要。
- `signup.criterionchannel.com`: 用于用户注册和订阅流程的专用子域名 8。这表明关键账户创建流程的关注点分离。
- `images.criterionchannel.com` (推断): 尽管未直接在资料中列为独立主机名，但 CC 网站富含图片内容（如电影海报、宣传横幅）的页面，例如 `https://www.criterionchannel.com/alix-s-pictures` 9 和浏览页面 10，以及常见的网络架构实践表明，图片资源很可能由类似此域名或主域名下的特定路径，或通过 CDN 提供。将此域名或通配符 `*.criterionchannel.com` 纳入规则是更稳妥的做法，因为流媒体网站通常图片密集，且使用专用子域名（如 `images.` 或 `img.`）托管图片是标准的网络架构模式，这有时是为了实现无 cookie 域名或组织结构目的。
- `static.criterionchannel.com` (推断): 与 `images.` 类似，这是一个推断的常见子域名，用于托管非第三方 CDN 提供的静态资源，如 CSS、JavaScript 文件、字体等。登录页面 11 和主页 5 都将依赖此类资源。网站需要 CSS、JavaScript 和可能的字体文件来正确渲染和运行。虽然其中一些可能位于 CDN 上（如 `cdnjs.cloudflare.com`），但特定于站点的静态资产通常托管在 `static.` 子域名下。确保这些资源被正确路由对于网站的显示和功能非常重要。

### B. Vimeo OTT 平台 - Criterion Channel 的支柱

CC 的视频服务明确由 Vimeo 提供支持 3。这使得 Vimeo 的 Over-The-Top (OTT) 平台域名至关重要。Vimeo 收购的 VHX 平台在 Vimeo OTT 产品中仍扮演核心角色，很可能支撑着像 CC 这样的服务。

- `vhx.tv`: 当登录 Vimeo OTT 时会使用此域名 12。它也被列为 Vimeo OTT 站点需要白名单的域名 13。一些 Vimeo OTT 站点的示例也使用 `*.vhx.tv` 14。此域名对于 CC 所依赖的核心 OTT 服务功能至关重要。
- `dns.vimeo.tv`: 此域名在为 Vimeo OTT 设置自定义域名时用作 CNAME 目标 15。这表明它是 Vimeo OTT DNS 基础设施的关键部分。虽然用户可能不直接与其交互，但他们与 `criterionchannel.com` 的连接可能会通过或与绑定到此域名的服务进行交互。

下表总结了 CC 及其核心后台 Vimeo OTT 的主要域名：

**表 1: 核心 Criterion Channel 与 Vimeo OTT 域名**

| **域名**                      | **用途/服务**                 | **重要性** | **来源参考** |
| ----------------------------- | ----------------------------- | ---------- | ------------ |
| `criterionchannel.com`        | 主要服务门户                  | 高         | 5            |
| `criterion.com`               | 母公司，支持，辅助信息        | 中         | 4            |
| `signup.criterionchannel.com` | 账户创建/订阅                 | 高         | 8            |
| `images.criterionchannel.com` | 图片托管 (推断)               | 中         | (9)          |
| `static.criterionchannel.com` | 静态资源托管 (CSS, JS) (推断) | 中         | (5)          |
| `vhx.tv`                      | Vimeo OTT 平台核心            | 高         | 12           |
| `dns.vimeo.tv`                | Vimeo OTT DNS 基础设施        | 中         | 15           |



## III. 流媒体与资源分发：内容分发网络 (CDN) 域名

### A. CDN 使用说明

内容分发网络 (CDN) 是地理上分散的服务器网络，它们存储网页内容的副本（如视频、图片、脚本），并将其置于离最终用户更近的位置。这减少了延迟，改善了加载时间，并增强了整体流媒体体验。像 CC 这样的流媒体服务严重依赖 CDN 来实现流畅的视频播放 16。

### B. 已识别的 CDN 提供商域名

Vimeo（以及 CC）采用多 CDN 策略，利用其自有 CDN 及多个主要的第三方 CDN（如 Akamai, CloudFront, Fastly）13。这种策略增强了服务的韧性和性能。依赖单一 CDN 会产生单点故障风险，而不同的 CDN 在不同地理区域具有不同的优势。使用多个 CDN 可以实现负载均衡、故障转移能力，并通过为特定用户或地区选择性能最佳或最具成本效益的 CDN 来优化成本。因此，分流规则必须包含所有这些 CDN 的域名，以确保不间断的服务和最佳性能。

- `vimeocdn.com`: 这是 Vimeo 自有或品牌的 CDN，用于分发视频内容和其他资源 13。它是 Vimeo 支持服务的主要 CDN 之一。
- `akamaized.net`: 此域名属于 Akamai，一家主要的全球 CDN 提供商。Vimeo 使用 Akamai 进行内容分发 13。
- `cloudfront.net`: 此域名属于 Amazon Web Services (AWS) CloudFront，另一家领先的 CDN。Vimeo 也使用 CloudFront 13。
- `*.global.ssl.fastly.net`: 此模式代表托管在 Fastly 上的域名，Fastly 是 Vimeo 使用的另一家 CDN 提供商 16。17 提供了 `your-test-site.global.ssl.fastly.net` 的示例以及 CNAME 目标 `*.sni.global.fastly.net`。这里的通配符 `*` 很重要，因为具体的子域名可能会变化。
- `cdnjs.cloudflare.com`: 虽然主要作为开源 JavaScript 库和 CSS 的 CDN 20，但 Vimeo 将其用于其播放器组件 22。其可靠性对播放器功能至关重要。

鉴于 CDN 主机名（例如，`xyz.cloudfront.net` 或 `abc.akamaized.net`）数量众多且可能动态生成，以及像 `*.global.ssl.fastly.net` 17 这样的域名结构，使用通配符规则变得至关重要。代理工具通常支持 `DOMAIN-SUFFIX` 或通配符 `DOMAIN-KEYWORD` 类型的规则，这些规则非常适合 CDN 域名，因为列出每个可能的 CDN 主机名是不切实际的。建议用户对这些 CDN 父域名使用基于后缀或关键字的规则，以实现全面覆盖。

**表 2: 内容分发网络 (CDN) 域名**

| **域名/模式**             | **CDN 提供商** | **用途**          | **来源参考** |
| ------------------------- | -------------- | ----------------- | ------------ |
| `vimeocdn.com`            | Vimeo          | 视频/资源分发     | 16           |
| `akamaized.net`           | Akamai         | 视频/资源分发     | 16           |
| `cloudfront.net`          | AWS CloudFront | 视频/资源分发     | 16           |
| `*.global.ssl.fastly.net` | Fastly         | 视频/资源分发     | 16           |
| `cdnjs.cloudflare.com`    | Cloudflare     | JS 库, 播放器组件 | 20           |



## IV. 功能支柱：API、认证及服务特定域名 (Criterion/Vimeo)

应用程序编程接口 (API) 对于获取内容元数据、用户信息、流媒体清单和管理播放至关重要。CC 的运作可能涉及一个双层 API 结构：一层是 CC 特有的 API，处理其独特功能；另一层是 Vimeo 的后端 API，负责核心视频服务。

### A. API 端点

- `api.vimeo.com`: 这是 Vimeo API 的标准域名。尽管 23 在 Postman 集合上下文中显示了 `vimeo.com` 下的 API 路径，如 `/api/authentication`，但 `api.vimeo.com` 是 Vimeo 的规范 API 域名。24 也提及了 Vimeo API 的交互。
- Criterion Channel 自有 API: 25 提到有用户“逆向工程了私有 API”，这表明 CC 可能拥有自己的 API 端点，很可能托管在 `criterionchannel.com` 之下（例如 `api.criterionchannel.com` 或主域名下的路径）。这些 API 将处理 CC 特有的、通用 Vimeo OTT 后台未涵盖的功能（如精选合集、编辑内容）。

### B. 认证与用户账户管理

涉及登录、会话管理和用户配置文件服务的域名。这些功能可能由 `criterionchannel.com`（登录见 11）、`signup.criterionchannel.com` 8 以及通过 `vimeo.com` 或 `api.vimeo.com` 的 Vimeo 认证机制处理（23 提及 `/api/authentication`）。

### C. Vimeo 服务特定域名 (OTT 核心之外)

- `vimeo.com`: Vimeo 的主域名至关重要。Vimeo OTT 站点需要将其列入白名单 13，并且它可能托管各种底层服务、API（如 23 所示）以及潜在的用户认证重定向或 iframe 内容。12 区分了 `vimeo.com` (Vimeo Core) 和 `vhx.tv` (Vimeo OTT)，但 13 指出 OTT 服务也需要 `vimeo.com`。
- Vimeo Analytics: Vimeo 为其视频提供分析功能 26。这些服务很可能托管在 `vimeo.com` 或其子域名上。虽然不直接用于播放，但它们是平台生态系统的一部分。

**表 3: API、认证及服务特定域名 (Criterion/Vimeo)**

| **域名**                          | **用途/服务**                  | **可能的交互**           | **来源参考** |
| --------------------------------- | ------------------------------ | ------------------------ | ------------ |
| `api.vimeo.com`                   | Vimeo API                      | 数据获取, 播放控制       | 23           |
| `vimeo.com`                       | Vimeo 核心服务, 认证, API 托管 | 认证, 嵌入内容, API 调用 | 12           |
| `*.criterionchannel.com` (API用)  | Criterion Channel 特定 API     | 内容元数据, 用户数据     | (25)         |
| `criterionchannel.com` (认证路径) | 用户认证                       | 登录, 会话管理           | 11           |



## V. 必要的第三方服务域名

现代网络服务通常依赖于一个由第三方工具和服务组成的生态系统。

### A. 支付处理

CC 的订阅服务依赖于第三方支付处理商。如果这些支付相关域名被阻止或错误路由，用户可能无法订阅、更新支付方式或自动续订。

- `stripe.com`: Criterion.com 的隐私政策提到 Stripe, Inc. 是其信用卡授权服务商 7。CC 帮助部分也确认其支付处理商已通过 PCI 服务提供商 1 级认证 28，这是像 Stripe 这样的主要处理商的特征。
- `link.com`: 这是 Stripe 用于一键结账的服务，CC 提供了如何使用 Stripe Link 的说明 29。

### B. 分析与用户行为追踪

CC 使用分析服务来了解用户行为并改进平台。阻止这些域名通常不会影响核心视频播放，但可能会影响 CC 的数据收集或用户参与 A/B 测试的能力。

- `google-analytics.com` / `www.google-analytics.com`: Criterion.com 使用 Google Analytics 7。诸如 `ssl.google-analytics.com` 或 `region1.google-analytics.com` 之类的子域名也很常见。
- Optimizely: CC 使用 Optimizely 5。虽然未列出具体域名，但常见的 Optimizely 域名包括 `optimizely.com`、`cdn.optimizely.com`、`log.optimizely.com`。30 和 31 讨论了 Optimizely 与 Vimeo/Youtube 的集成。

### C. 错误追踪与监控

- Sentry.io: CC 使用 Sentry.io (32 暗示 Codecov 与 Sentry 集成用于 CC，24 提及 Vimeo 使用 Sentry)。常见域名：`sentry.io` 及其子域名如 `*.ingest.sentry.io`。

### D. 数字版权管理 (DRM) 许可证获取

DRM 对于受版权保护内容的播放至关重要。CC（通过 Vimeo）使用 Google Widevine、Apple FairPlay 和 Microsoft PlayReady 33。这些系统需要与许可证服务器通信以获取解密密钥。如果未能正确获取许可证，加密内容将无法播放。许可证服务器可能由 DRM 提供商（Google、Apple、Microsoft）托管，或者由 Vimeo/Criterion 在其自己的域名下作为代理托管。由于许可证服务器 URL 的动态性和通常不透明的性质，很难详尽列出。如果播放失败，DRM 许可问题是代理日志中需要调查的关键领域。

- **Google Widevine**: 通常涉及 `*.widevine.com` 或流媒体服务设置的许可证代理。35 提到了“Widevine 许可证服务器”，并且许可证协议是“通过 HTTPS”进行的。36 确认 Widevine 用于 Chrome、Firefox、Edge、Android。
- **Apple FairPlay**: 用于 Apple 设备。许可证获取通常涉及 Apple 控制的服务器或被授权分发许可证的 CDN。37 提到需要从 Apple 获取 FairPlay 证书并将其上传到视频平台（以 BytePlus VOD 为例）。38 显示了应用程序与开发者/服务提供的许可证 URL 和证书 URL 通信的代码示例。这些 URL 可能位于 `*.apple.com` 或自定义域名上。
- **Microsoft PlayReady**: 用于 Microsoft 设备/浏览器。涉及与 PlayReady 许可证服务器的通信 39。这些可能位于 `*.microsoft.com` 或特定的服务域名上。

### E. 客户支持平台 (潜在)

虽然支持通过 `channelhelp@criterion.com` 提供 1，但如果他们使用第三方帮助台平台（例如 Zendesk、Intercom），则需要该平台的域名才能实现完整的支持门户功能。目前没有明确指出此类平台。

**表 4: 关键第三方服务域名**

| **域名/模式**                                              | **服务提供商** | **用途**         | **对播放的重要性** | **来源参考** |
| ---------------------------------------------------------- | -------------- | ---------------- | ------------------ | ------------ |
| `stripe.com`                                               | Stripe         | 支付处理         | 间接高 (订阅)      | 7            |
| `link.com`                                                 | Stripe         | 一键结账         | 间接高 (订阅)      | 29           |
| `google-analytics.com` (及相关)                            | Google         | 网站分析         | 低                 | 7            |
| `*.optimizely.com` (模式)                                  | Optimizely     | A/B 测试, 个性化 | 低                 | 5            |
| `*.sentry.io` (模式)                                       | Sentry         | 错误追踪         | 低                 | 24           |
| `*.widevine.com` (模式)                                    | Google         | DRM 许可证获取   | 高                 | 33           |
| (潜在 Apple FairPlay 域名, 如 `*.apple.com` 子域)          | Apple          | DRM 许可证获取   | 高                 | 33           |
| (潜在 Microsoft PlayReady 域名, 如 `*.microsoft.com` 子域) | Microsoft      | DRM 许可证获取   | 高                 | 33           |



## VI. 用于分流规则的合并域名列表

### A. 汇总列表

下表汇总了先前识别的所有域名，按类别进行组织，为用户创建分流规则提供了直接的参考。

**表 5: 用于分流规则的合并域名列表**

| **域名/模式**                         | **类别**        | **推荐规则类型**                    | **备注 (例如：地理敏感, 支付, DRM)** |
| ------------------------------------- | --------------- | ----------------------------------- | ------------------------------------ |
| `criterionchannel.com`                | 核心服务        | `DOMAIN-SUFFIX`                     | 地理敏感                             |
| `criterion.com`                       | 核心服务        | `DOMAIN-SUFFIX`                     | 地理敏感, 支持                       |
| `signup.criterionchannel.com`         | 核心服务        | `DOMAIN-SUFFIX`                     | 地理敏感, 账户                       |
| `images.criterionchannel.com`         | 核心服务 (推断) | `DOMAIN-SUFFIX`                     | 地理敏感                             |
| `static.criterionchannel.com`         | 核心服务 (推断) | `DOMAIN-SUFFIX`                     | 地理敏感                             |
| `vhx.tv`                              | Vimeo OTT       | `DOMAIN-SUFFIX`                     | 地理敏感, 核心后台                   |
| `dns.vimeo.tv`                        | Vimeo OTT       | `DOMAIN-SUFFIX`                     | 地理敏感, DNS                        |
| `vimeocdn.com`                        | CDN             | `DOMAIN-SUFFIX`                     | 地理敏感, 视频流                     |
| `akamaized.net`                       | CDN             | `DOMAIN-SUFFIX`                     | 地理敏感, 视频流                     |
| `cloudfront.net`                      | CDN             | `DOMAIN-SUFFIX`                     | 地理敏感, 视频流                     |
| `*.global.ssl.fastly.net`             | CDN             | `DOMAIN-KEYWORD` 或 `DOMAIN-SUFFIX` | 地理敏感, 视频流                     |
| `cdnjs.cloudflare.com`                | CDN             | `DOMAIN-SUFFIX`                     | 播放器组件                           |
| `api.vimeo.com`                       | API             | `DOMAIN-SUFFIX`                     | 地理敏感, 功能                       |
| `vimeo.com`                           | API / 服务      | `DOMAIN-SUFFIX`                     | 地理敏感, 功能, 认证                 |
| `*.criterionchannel.com` (API用)      | API             | `DOMAIN-SUFFIX`                     | 地理敏感, 功能                       |
| `stripe.com`                          | 支付            | `DOMAIN-SUFFIX`                     | 支付 (可能需直连或特定代理)          |
| `link.com`                            | 支付            | `DOMAIN-SUFFIX`                     | 支付 (可能需直连或特定代理)          |
| `google-analytics.com`                | 分析/追踪       | `DOMAIN-SUFFIX`                     | 可选 (可拒绝)                        |
| `*.optimizely.com`                    | 分析/追踪       | `DOMAIN-SUFFIX` 或 `DOMAIN-KEYWORD` | 可选 (可拒绝)                        |
| `*.sentry.io`                         | 分析/追踪       | `DOMAIN-SUFFIX` 或 `DOMAIN-KEYWORD` | 可选 (可拒绝)                        |
| `*.widevine.com`                      | DRM             | `DOMAIN-SUFFIX` 或 `DOMAIN-KEYWORD` | 地理敏感, DRM (关键)                 |
| `*.googleapis.com`                    | DRM (潜在)/服务 | `DOMAIN-SUFFIX`                     | 地理敏感, DRM (潜在)                 |
| `*.apple.com` (FairPlay相关子域)      | DRM (潜在)      | `DOMAIN-SUFFIX`                     | 地理敏感, DRM (潜在)                 |
| `*.microsoft.com` (PlayReady相关子域) | DRM (潜在)      | `DOMAIN-SUFFIX`                     | 地理敏感, DRM (潜在)                 |

### B. 关于规则格式的指南

在配置代理工具时，通常使用以下类型的规则：

- `DOMAIN-SUFFIX`: 匹配指定后缀的所有域名（例如，`DOMAIN-SUFFIX,criterionchannel.com,PROXY_US` 将匹配 `criterionchannel.com` 及其所有子域名）。这是针对这些服务最常用且有效的规则类型。
- `DOMAIN`: 仅匹配指定的完整域名。
- `DOMAIN-KEYWORD`: 匹配域名中包含指定关键字的域名。

对于 CC，建议将上述列表中的域名通过位于美国或加拿大的代理服务器（通常标记为 PROXY_US 或类似名称）进行路由。例如：

DOMAIN-SUFFIX,criterionchannel.com,PROXY_US

DOMAIN-SUFFIX,vhx.tv,PROXY_US

DOMAIN-SUFFIX,vimeocdn.com,PROXY_US

DOMAIN-KEYWORD,global.ssl.fastly.net,PROXY_US

DOMAIN-SUFFIX,stripe.com,PROXY_US (或 DIRECT，如果支付不应通过特定代理)

DOMAIN-SUFFIX,google-analytics.com,PROXY_US (或 REJECT，如果希望阻止分析)

DOMAIN-SUFFIX,widevine.com,PROXY_US

## VII. 规则实施的重要注意事项

### A. 地理限制与代理选择

重申 CC 主要在美国和加拿大提供服务 1。规则应将相关域名流量导向位于这些国家的代理服务器。有信息表明美国账户可能拥有比加拿大账户更多的内容 3（尽管英国并非 CC 官方支持地区，此信息可能指 Criterion Collection 的实体媒体或存在误解）。为确保最佳内容库访问，建议使用位于美国的代理服务器。

### B. 服务的动态性

必须强调，域名列表（尤其是 CDN 和 API 的域名）可能会随着服务的发展而随时间变化。所提供的列表基于当前研究，但可能需要更新。如果出现问题，建议用户偶尔检查代理日志中与 CC 相关但未处理的域名。

### C. 与 VPN 的交互

如果使用系统级 VPN，这些分流规则可能显得多余，除非需要更细致的控制（例如，仅将 CC 流量通过特定 VPN 服务器路由，而其他流量直连或通过其他代理）。一些代理工具可以与 VPN 协同工作。

### D. 确保完整功能性

所有组件（账户创建、登录、浏览、流媒体播放、DRM、支付、支持）都需要正确路由其各自的域名。过于激进或不完整的规则可能会破坏服务的部分功能。有资料提到过去仅需在账户创建时使用 VPN 的技巧，但随后建议保持 VPN开启 3。这表明 IP 检查可能在不同阶段发生。因此，一个全面的规则集更为可靠，不应依赖“注册一次，无需代理随处观看”的过时方法。

### E. HTTPS 与安全

所有列出的服务均使用 HTTPS (28 提及“对所有敏感数据强制使用 HTTPS”)。代理工具必须正确处理 HTTPS 流量（基于域名的规则通常依赖 SNI 检测）。

### F. 测试规则

实施规则后，建议进行彻底测试：

- 用户能否注册/登录？
- 能否浏览内容？
- 视频播放能否正常开始（DRM 是否工作）？
- 能否访问账户设置和支持？
- （如适用）能否进行支付？

## VIII. 结论与建议

### A. 重要性回顾

精心制作的分流规则集是从不受支持的地区可靠访问 The Criterion Channel 并确保其所有组件功能顺畅的关键。

### B. 维护建议

用户应将规则集视为一个动态配置。如果发现新域名或服务基础设施发生变化，应定期审查和更新列表。关注在线社区或论坛中关于此类规则集的讨论，其他用户可能会分享更新。

### C. 最终建议

希望本报告提供的信息能帮助用户成功创建一套有效的规则集，以便充分享受 The Criterion Channel 提供的电影内容。由于 DRM 许可证服务器的具体域名可能难以完全确定，如果遇到播放问题，除了检查核心服务和 CDN 域名外，还应考虑临时添加针对 `*.googleapis.com` (常用于 Google 服务，包括 Widevine 的某些方面)、`*.apple.com` 和 `*.microsoft.com` 等主要技术提供商的更广泛规则，并监控网络流量以识别确切的许可证服务器通信端点。