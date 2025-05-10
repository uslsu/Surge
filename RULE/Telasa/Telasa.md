# Telasa 分流规则集分析与构建
<details>
<summary>▶ 1. Telasa 服务与域名架构</summary>

<details>
<summary>▶ 1.1. Telasa 概述</summary>

Telasa (テラサ) 是一家日本的订阅制视频点播 (SVOD) 服务。该服务由 KDDI（一家日本主要的电信运营商）和朝日电视台（一家日本主要的电视网络）各持股 50% 共同运营 <sup>1</sup>。这种共同持股的结构对其域名体系和基础设施有重要影响。

该服务最初于 2012 年 5 月 15 日以“Video Pass” (ビデオパス，亦称 “au Video Pass”) 的名义推出，后于 2020 年 4 月 7 日更名为 Telasa <sup>1</sup>。这段历史意味着与 Video Pass 相关的旧有域名仍然具有高度相关性。

Telasa 主要面向日本市场，提供来自朝日电视台的内容、电影、动漫及其他娱乐节目 <sup>1</sup>。其官方网站为 `telasa.jp` 和 `navi.telasa.jp` <sup>1</sup>。

双重所有权和品牌重塑的历史表明，Telasa 可能拥有一个复杂的基础设施，融合了来自两家母公司及旧系统的元素。朝日电视台提供内容，而作为电信巨头的 KDDI 则可能提供大量的网络和后端基础设施，包括身份管理 (au ID) 和支付服务。一个值得注意的现象是，在 Telasa 品牌重塑多年后，`videopass.jp` 域名以及 `kddi-video.com` 的许多子域名（其中不少仍包含 "videopass" 字样）依然在服务中扮演着重要角色。这揭示了其基础设施具有显著的惯性，后端系统可能非常复杂且分层，并未在品牌重塑过程中被完全迁移或整合到统一的 `telasa.jp` 域名结构下。对于大型流媒体服务而言，品牌重塑是一项艰巨的任务，后端 API、内容分发工作流和认证系统都已深度嵌入。为了避免服务中断，企业通常会保留旧有域名和子域名用于后端操作，即使面向用户的品牌已发生改变。社群维护的规则列表（如 <sup>15</sup>）明确将这些带有旧名称的 `kddi-video.com` 子域名归类于 Telasa 服务下，进一步证实了它们持续的运营作用。
</details>

<details>
<summary>▶ 1.2. 主要及关键关联域名</summary>

* **主要域名**:
    * `telasa.jp`: Telasa 服务的主域名 <sup>1</sup>。
    * `navi.telasa.jp`: Telasa 的一个关键门户或导航子域名 <sup>3</sup>。
* **关键关联域名 (因所有权及历史沿革)**:
    * `kddi-video.com`: 此域名及其子域名对于 Telasa 的后端运营至关重要，包括用于播放、支付、登录和内容元数据的 API <sup>13</sup>。这些子域名中持续使用 "videopass" (例如 `api-videopass-*.kddi-video.com`) 突显了旧有基础设施的重要性。
    * `videopass.jp`: 该服务的前域名。它仍出现在各种社区规则集和 DNS 查询工具中，与 Telasa 域名并列，表明其可能仍在持续运营或对完整服务功能而言仍有必要性 <sup>1</sup>。
    * `tv-asahi.co.jp`: 虽然主要作为内容提供商，但与朝日电视台相关的域名可能参与内容分发、元数据或推广等方面 <sup>1</sup>。

`videopass.jp` 和 `kddi-video.com` (带有 "videopass" 子域名) 的持续存在强烈暗示，在品牌重塑为 Telasa 的过程中，后端基础设施并未进行彻底改革。这意味着一个全面的分流规则集必须考虑到这些历史遗留但仍活跃的域名。同时，域名结构（尤其是对 `kddi-video.com` 在 API、支付和登录方面的重度依赖）有力地表明，尽管朝日电视台是内容合作伙伴，但 KDDI 管理着绝大部分技术后端，并利用其现有的电信和数字服务基础设施。作为主要的电信运营商 <sup>1</sup>，KDDI 拥有广泛的网络基础设施、数据中心以及成熟的身份认证 (au ID - <sup>26</sup>) 和支付 (au Payment Corporation - <sup>25</sup>, `api-payment.kddi-video.com` - <sup>15</sup>) 平台。对于合资公司而言，利用这些现有且强大的 KDDI 系统，比从头构建全新的系统或依赖主要作为广播公司的朝日电视台来处理此类技术操作更为高效。
</details>

<details>
<summary>▶ 1.3. 地理限制与可访问性</summary>

Telasa 官方仅在日本提供服务 <sup>28</sup> (因其为日本服务 <sup>1</sup>)。日本以外的用户通常需要使用具有日本 IP 地址的 VPN 或代理才能访问该服务。

一些常见的 VPN 可能无法有效地与 Telasa 配合使用，这表明该服务可能采用了某些 VPN/代理检测机制 <sup>29</sup>。这更突显了制定精确且全面的规则集的必要性，以确保所有必要的流量都通过指定的日本代理正确路由。有提及“知名的VPN无法用于Telasa”，“需要使用不太知名或日本的VPN” <sup>29</sup>，这暗示Telasa可能正在积极封锁与常见VPN服务相关的IP。流媒体服务若有严格的地理授权限制，通常会实施VPN检测以遵守内容版权。如果Telasa检测到非日本访问或已知的VPN IP，它可能会阻止连接。这使得精确的规则集更为关键，因为它能确保只有Telasa特定的流量通过（希望是较不常见或住宅IP的）日本代理路由，从而最大限度地减少代理的足迹，并与路由所有互联网流量相比，降低被检测的风险。

对用户而言，寻求此类规则集的主要动机很可能是为了绕过这些地理限制。因此，规则必须确保 Telasa 的所有功能组件都通过日本代理进行路由。
</details>
</details>

<details>
<summary>▶ 2. Telasa 核心功能域名</summary>

<details>
<summary>▶ 2.1. 流媒体内容分发</summary>

* **已识别的 CDN 域名**:
    * `d2lmsumy47c8as.cloudfront.net`: 这个亚马逊 CloudFront 域名在多个来源中被明确列为 Telasa 用于内容分发的域名 <sup>13</sup>。CloudFront 是一个全球性的 CDN，但对于 Telasa 而言，它会被配置为主要从日本或日本附近的边缘节点提供内容。
* **KDDI 特定的内容/资产域名**:
    * `image-cf.kddi-video.com`: 可能用于分发图像（海报、缩略图、UI 资产）<sup>15</sup>。域名中的 "cf" 可能会让人误以为是 CloudFront，但它实际上是 `kddi-video.com` 的一个子域名。
    * `cf-assets.synapse-kddi.net`: 这个与 KDDI 的 Synapse 网络相关的域名，也可能用于资产分发 <sup>15</sup>。`synapse-kddi.net` 直接指向 KDDI 的网络基础设施。
* **通用流媒体端点 (通过 API 域名)**:
    * 实际的视频流 URL 通常是动态的，并通过 API 调用获取。`api-videopass-playback.kddi-video.com` 域名 <sup>15</sup> 对于启动和管理播放会话至关重要。
* **日本 CDN 的广泛使用**:
    * 日本的流媒体服务普遍使用如 Akamai、Cloudflare 和 Fastly 等 CDN <sup>31</sup>。虽然除了 CloudFront 之外，Telasa 并未直接确认使用这些 CDN，但这表明了该地区对成熟 CDN 提供商的普遍依赖。<sup>73</sup> 提到了与东京服务器相关的 Akamai，<sup>74</sup> 提到了用于日本地区访问的 Cloudflare Warp。

Telasa 似乎采用了混合内容分发策略。通用资产和部分视频片段可能来自 CloudFront，而其他资产和关键的播放控制则可能通过 KDDI 自身的基础设施处理。这使得 Telasa 能够通过 CloudFront 实现可扩展性，同时在其 au 用户群的 KDDI 网络内保持控制并可能优化分发。如果 `d2lmsumy47c8as.cloudfront.net` 是主要的视频 CDN，并且未能正确通过日本代理路由，流媒体播放将会失败或暴露用户的真实位置。该 CloudFront 域名对于实际视频片段的传输至关重要，其 IP 解析必须在日本境内完成，以符合地理合规性要求并从日本的边缘服务器获取内容。不正确的路由将导致访问错误或从非最佳边缘位置获取内容。
</details>

<details>
<summary>▶ 2.2. API 端点</summary>

Telasa 的绝大多数 API 操作都由 `kddi-video.com` 的子域名处理。这有力地表明 KDDI 的基础设施承载着该服务的核心后端逻辑。

* **关键 API 子域名** <sup>15</sup>:
    * `api-videopass.kddi-video.com`: 可能是一般服务功能的通用 API 端点。
    * `api-videopass-anon.kddi-video.com`: 暗示这是一个用于匿名用户或初始未认证交互（例如登录前浏览内容）的 API 端点。
    * `api-videopass-login.kddi-video.com`:专门用于用户登录和认证过程。
    * `api-videopass-playback.kddi-video.com`: 对于启动视频播放、获取流 URL 和管理播放会话至关重要。
    * `api-payment.kddi-video.com`: 处理支付处理和订阅管理。
    * `theater.kddi-video.com`: 可能用于特定的内容视图，例如电影页面或“影院”模式的用户界面（<sup>16</sup> 显示内容位于 `ecs-web.kddi-video.com` 和 `web.kddi-video.com`，但 `theater.kddi-video.com` 在规则列表中）。
    * `showroom.kddi-video.com`: 可能用于推广内容、直播活动或特别展示 <sup>15</sup>。
* 来自 1-stream/1stream-public-utils <sup>33</sup> 和其他通用 GitHub 规则列表 <sup>37</sup> 的其他类似 API 的域名大多是通用的或用于其他服务，但 API 子域名的 **模式** 是一致的。

在提供的片段中，`telasa.jp` 本身并未直接显示诸如 `/api/`、`/v1/`、`/auth/`、`/login/`、`/metadata/`、`/epg/` 之类的特定 API 路径（在 <sup>5</sup> 中查询），这进一步证实了这些功能已转移到 `kddi-video.com` 的子域名下处理。

这些 API 子域名中广泛使用 "videopass" 强烈表明 Telasa 当前的 API 基础设施在很大程度上继承自其前身 Video Pass。这些端点对于从浏览到播放再到支付的服务的各个方面都至关重要。`kddi-video.com` 域名为其 API 采用了高度精细化的子域名策略（例如 `-anon`, `-login`, `-playback`, `-payment`）。这表明后端可能采用了类似微服务的架构，其中不同的功能由不同的服务处理，每个服务都有其自己的 API 端点。这种精细化允许不同服务组件的独立扩展、开发和维护。对于规则集而言，这意味着针对这些子域名的单个规则可能比笼统的 `*.kddi-video.com` 规则更精确，尽管后者是一个很好的后备方案。
</details>

<details>
<summary>▶ 2.3. 认证机制</summary>

* **TELASA ID 登录**:
    * 登录/注册用户界面: `telasa.jp/login` <sup>11</sup>, `telasa.jp/landing` <sup>5</sup>。
    * TELASA ID 的后端 API: `api-videopass-login.kddi-video.com` <sup>15</sup>。
    * TELASA ID 通信的邮件域名: `@telasa.co.jp` <sup>27</sup>。
* **au ID 登录**:
    * Telasa 支持通过 au ID (KDDI 的通用身份服务) 登录 <sup>3</sup>。
    * 关键 au ID 域名: `id.auone.jp` (这是 au 服务的中央认证门户)。虽然在 Telasa 特定的规则片段中没有明确列出 <sup>13</sup>，但它是基于 au ID 的登录和支付（<sup>26</sup> 提及使用 au ID 的 auかんたん決済）的已知要求。
    * au ID 通信的邮件域名: `@connect.auone.jp` <sup>27</sup>。
* **其他认证相关域名** <sup>27</sup>:
    * `@csmail.kddi.com`, `@form.au.com`: 用于邮件查询，可能涉及账户恢复或可能触及认证的支持互动。

双重认证系统（TELASA ID 和 au ID）意味着规则集必须同时适应两者。au ID 登录将涉及对 `id.auone.jp` 以及可能其他 `au.com` 或 `auone.jp` 子域名的重定向和通信。确保这些域名被正确代理对于使用 au ID 登录的用户至关重要。au ID 不仅仅是一个登录选项，它与支付（auかんたん決済）以及潜在的用户资料/历史（如果用户最初来自 au Video Pass）紧密相连。这使得 `id.auone.jp` 和相关的 `auone.jp` 域名对于一部分用户而言至关重要 <sup>26</sup>。如果这些 au ID 交互没有被代理，这些用户的登录和支付可能会失败。
</details>

<details>
<summary>▶ 2.4. 支付网关</summary>

* **Telasa 特定的支付 API**:
    * `api-payment.kddi-video.com`: 该域名被明确列为处理支付的域名 <sup>15</sup>。
* **支持的支付方式 (<sup>3</sup>)**:
    * auかんたん決済 (au Easy Payment): 这是 KDDI 自有的支付服务，与 au ID 深度集成。交易很可能涉及 KDDI 的金融服务域名。
    * d払い (d-payment): NTT Docomo 的支付服务。
    * ソフトバンクまとめて支払い (Softbank collective payment)。
    * 信用卡。
    * Amazon Pay (用于通过 Fire TV 发起的订阅 <sup>42</sup>)。
* **KDDI 金融基础设施**:
    * au Payment Corporation 是 KDDI 集团公司之一 <sup>25</sup>，表明 KDDI 的内部支付基础设施得到了利用。

对于使用 auかんたん決済 支付的用户，流量很可能流经 `api-payment.kddi-video.com`，然后可能流向其他 KDDI/au ID 域名进行授权。通过 d-払い 或 Softbank 进行的支付将涉及重定向到它们各自的支付门户。如果 `api-payment.kddi-video.com` 集成了支付服务提供商，信用卡支付可能直接通过该域名处理，或者也可能涉及重定向。规则集需要确保 `api-payment.kddi-video.com` 被代理，并且用户应意识到，如果他们选择其他支付方式，其他支付提供商的域名可能也需要被代理。
</details>

**表1: Telasa 核心关联域名及其功能汇总**
| 域名/模式                           | 主要功能                     | 服务关联        | 备注                                      |
| :---------------------------------- | :--------------------------- | :-------------- | :---------------------------------------- |
| `telasa.jp`                         | 主网站，用户界面             | Telasa          |                                           |
| `navi.telasa.jp`                    | 导航，用户界面               | Telasa          |                                           |
| `videopass.jp`                      | 旧域名，潜在的后端/重定向    | Telasa (旧版)   | 仍出现在规则列表中                        |
| `d2lmsumy47c8as.cloudfront.net`     | CDN 用于视频/资产            | Telasa (通过 AWS) | 对流媒体至关重要                          |
| `image-cf.kddi-video.com`           | 图像/UI 资产分发           | KDDI for Telasa |                                           |
| `cf-assets.synapse-kddi.net`        | 资产分发                     | KDDI for Telasa |                                           |
| `api-videopass.kddi-video.com`      | 通用 API                     | KDDI for Telasa |                                           |
| `api-videopass-anon.kddi-video.com` | 匿名用户 API                 | KDDI for Telasa | 例如，浏览内容                            |
| `api-videopass-login.kddi-video.com`| TELASA ID 认证 API           | KDDI for Telasa |                                           |
| `api-videopass-playback.kddi-video.com` | 播放控制 API                 | KDDI for Telasa | 获取流 URL，会话管理                      |
| `api-payment.kddi-video.com`      | 支付处理 API                 | KDDI for Telasa |                                           |
| `theater.kddi-video.com`            | 特定内容视图/UI API          | KDDI for Telasa |                                           |
| `showroom.kddi-video.com`           | 推广/特别内容 API            | KDDI for Telasa |                                           |
| `id.auone.jp`                       | au ID 认证                   | KDDI (au ID)    | 用于使用 au ID 登录/支付的用户            |
| `connect.auone.jp`                  | au ID 相关服务 (例如邮件)    | KDDI (au ID)    |                                           |
| `telasa.co.jp`                      | TELASA ID 相关服务 (例如邮件)| Telasa          |                                           |
| `*.kddi-video.com`                  | 其他 KDDI 后端服务的通配符   | KDDI for Telasa | 作为通用规则很重要                        |
</details>

<details>
<summary>▶ 3. 关联及第三方域名</summary>

<details>
<summary>▶ 3.1. 分析与追踪</summary>

* **Google Analytics / Google Tag Manager**:
    * <sup>54</sup> 显示一位曾参与“TELASA (テラサ，原KDDI Video Pass) 影音串流網站大型改版上線” (Telasa 音视频流媒体网站重大改版上线) 项目的“软件测试工程师(Web / Mobile App)”在其“使用技術或工具” (使用的技术或工具) 中列出了 "Google Analytics"。这是一个有力的间接证据。
    * 常用域名: `www.google-analytics.com`, `ssl.google-analytics.com`, `stats.g.doubleclick.net`, `www.googletagmanager.com`。
    * GTM <sup>43</sup> 和 GA <sup>45</sup> 的普遍使用非常广泛。
* **其他潜在的分析/APM/错误追踪服务**:
    * 基于其他流媒体服务的使用情况 <sup>13</sup>:
        * New Relic: `bam.nr-data.net`, `mobile-collector.newrelic.com`
        * Adobe Analytics: `*.hb.omtrdc.net`, `*.sc.omtrdc.net`
        * Sentry: `sentry.io`
* **朝日电视台数据共享惯例**:
    * <sup>75</sup> 提到，对于朝日电视台（Telasa 的共同所有者之一），观看时长、IP 地址和其他标识符会发送给电视台，并且“可能与第三方共享”。这表明了一种通用的数据收集和共享方法，可能也适用于 Telasa。

尽管 Telasa 第三方分析域名的直接详尽列表并未在资料中提供，但来自 <sup>54</sup> 的证据以及行业普遍做法使得 Google Analytics 等服务的使用具有高度可能性。流媒体服务是数据驱动的，而 Google Analytics 是一个常见且易于集成的选择。公开规则列表中缺乏明确的 Telasa 分析域名，可能意味着它们通过第一方域名进行路由，或者列表维护者认为它们对于代理而言并非至关重要。此外，<sup>75</sup> 中关于朝日电视台与第三方共享观看数据的声明，暗示了一种公司文化或现有协议，可能会延伸到其合资企业 Telasa。这进一步支持了用户可能希望主动管理（例如，阻止）分析/追踪域名的想法。
</details>

<details>
<summary>▶ 3.2. 广告网络 (如有)</summary>

Telasa 是一项订阅服务，因此不太可能出现流内视频广告。但是，广告可能会出于推广目的出现在网站上，或者如果存在免费增值层级（<sup>2</sup> 显示了一个“無料” - 免费 - 部分）。

像 `doubleclick.net`, `adsrvr.org`, `adsmoloco.com` 这样的域名在日本其他流媒体服务（如 Hulu Japan）中很常见 <sup>13</sup>，并且可能会遇到。

对于付费订阅服务，广告网络域名对于功能而言不那么关键，但出于隐私考虑可能需要阻止。
</details>

<details>
<summary>▶ 3.3. 其他第三方服务 (例如客户支持、字体等)</summary>

* **客户支持**: Telasa 的帮助页面 <sup>26</sup> 托管在 `help.telasa.jp`。邮件支持使用 `@telasa.co.jp`, `@csmail.kddi.com`, 和 `@form.au.com` <sup>27</sup>。并未发现 Telasa 使用类似 `tesla.com` <sup>52</sup> 的特定第三方聊天域名。

除非支持域名也执行某种与主服务相关联的身份验证检查，否则通常可以直接访问它们。
</details>

<details>
<summary>▶ 3.4. 处理这些域名的建议</summary>

* **分析/追踪域名**: 通常可以设置为 `REJECT` 或 `DIRECT`。出于隐私考虑，`REJECT` 更可取，因为它阻止请求离开用户设备。`DIRECT` 则将它们发送到代理之外。
* **广告域名**: 类似地，可以设置为 `REJECT` 或 `DIRECT`。
* **客户支持/杂项域名**: 通常设置为 `DIRECT`，除非观察到问题。

核心目标是确保 Telasa 流媒体正常工作。非必要的第三方服务不应干扰此目标，并且可以根据用户对隐私的偏好与潜在的轻微 UI 损坏（例如，如果字体 CDN 被阻止，将使用默认字体）进行处理。
</details>

**表2: 已识别的潜在第三方和分析域名及处理建议**
| 域名/模式                   | 类型           | 潜在服务            | 推荐操作 (默认)   | 备注                                   |
| :-------------------------- | :------------- | :------------------ | :---------------- | :------------------------------------- |
| `*.google-analytics.com`    | 分析           | Google Analytics    | `REJECT` / `DIRECT` | Telasa 可能使用 <sup>54</sup>。            |
| `*.googletagmanager.com`  | 标签管理       | Google Tag Manager  | `REJECT` / `DIRECT` | 通常与 Google Analytics 一起使用。       |
| `*.doubleclick.net`         | 广告 / 追踪    | Google Marketing    | `REJECT` / `DIRECT` | 常见追踪器。                             |
| `*.nr-data.net`             | APM / 分析     | New Relic           | `REJECT` / `DIRECT` | 在其他流媒体服务中常见。                 |
| `*.omtrdc.net`              | 分析           | Adobe Analytics     | `REJECT` / `DIRECT` | 在其他流媒体服务中常见。                 |
| `sentry.io`                 | 错误追踪       | Sentry              | `DIRECT`          | 被阻止的可能性较小，如果用户数据被发送，可能有助于 Telasa 调试问题。 |
| `help.telasa.jp`            | 客户支持       | Telasa              | `DIRECT`          |                                        |
| `csmail.kddi.com`           | 客户支持 (邮件)| KDDI                | `DIRECT`          |                                        |
| `form.au.com`               | 客户支持 (表单)| KDDI (au)           | `DIRECT`          |                                        |
</details>

<details>
<summary>▶ 4. Telasa 分流规则集</summary>

<details>
<summary>▶ 4.1. 常用规则语法解释</summary>

* `DOMAIN-SUFFIX`: 匹配该域名及其所有子域名。(例如, `DOMAIN-SUFFIX,telasa.jp,PROXY` 匹配 `telasa.jp`, `navi.telasa.jp`, `help.telasa.jp`)。这是针对服务最常用且通常最有效的规则类型。
* `DOMAIN`: 匹配确切的域名。(例如, `DOMAIN,specific.telasa.jp,PROXY`)。当后缀匹配过于宽泛时，用于特定主机。
* `DOMAIN-KEYWORD`: 如果关键字出现在域名中的任何位置，则匹配。(例如, `DOMAIN-KEYWORD,telasa,PROXY`)。作为捕获未列出或新子域名的通配符很有用，但如果关键字很常见，则可能过于宽泛。
* `IP-CIDR`: 匹配特定的 IP 地址范围。对于动态云托管服务通常不太有用，但如果为某些功能识别了静态 IP，则可以使用。（在提供的资料中未发现 Telasa 有值得为此创建通用规则集的特定 IP）。
* **规则动作**:
    * `PROXY` (或特定的代理组名称): 通过指定的代理路由流量。对于解除地理限制至关重要。
    * `DIRECT`: 直接将流量路由到互联网，绕过代理。
    * `REJECT`: 阻止请求。

理解这些语法对于用户解释、使用并可能修改提供的规则集至关重要。
</details>

<details>
<summary>▶ 4.2. 综合规则集 (适用于 Surge/Clash 类工具的格式)</summary>

规则将以纯文本格式呈现，通常每行一条规则。注释将用于划分区域。在许多代理工具中，规则是按顺序评估的。对于同一服务，更具体的 `DOMAIN` 规则通常应位于更广泛的 `DOMAIN-SUFFIX` 或 `DOMAIN-KEYWORD` 规则之前，以确保精确路由。关键字规则最容易产生误报，通常应放在针对某个服务的 `PROXY` 规则的最后。

虽然列出所有已知的子域名（例如 <sup>15</sup> 中 `kddi-video.com` 的子域名）可以提供最大的精确度，但这会使列表冗长且难以维护。`DOMAIN-SUFFIX,kddi-video.com,PROXY` 规则更为简洁，并且更能适应未来可能出现的新子域名，但如果存在某个非必要或有问题的 `kddi-video.com` 子域名，则可能会无意中将其代理。此处提出的列表试图通过单独列出那些功能明确且关键的已知 API 子域名，并使用后缀规则来覆盖更广泛的范围，从而在精确性和可维护性之间取得平衡。

Telasa 分流规则集
请根据您的代理工具和策略组名称调整 PROXY 动作
主要服务访问与用户界面
DOMAIN-SUFFIX,telasa.jp,PROXY
DOMAIN-SUFFIX,telasa.co.jp,PROXY # 用于邮件及潜在其他服务
DOMAIN-SUFFIX,videopass.jp,PROXY # 旧域名，但仍建议保留

内容分发 (CDN 与资产)
DOMAIN,d2lmsumy47c8as.cloudfront.net,PROXY
DOMAIN-SUFFIX,kddi-video.com,PROXY # 这是一个较宽泛的规则；下面更具体的API/认证/支付子域名规则（如果工具支持）将优先匹配，但此规则可作为其他kddi-video.com流量（如图像分发或未列出的API端点）的良好补充。
DOMAIN-SUFFIX,synapse-kddi.net,PROXY # 特别是 cf-assets.synapse-kddi.net

API 通信
DOMAIN,api-videopass.kddi-video.com,PROXY
DOMAIN,api-videopass-anon.kddi-video.com,PROXY
DOMAIN,api-videopass-playback.kddi-video.com,PROXY
DOMAIN,theater.kddi-video.com,PROXY
DOMAIN,showroom.kddi-video.com,PROXY

注意：登录和支付API域名在各自部分中列出以保持清晰，但它们也属于API域名
认证
DOMAIN,api-videopass-login.kddi-video.com,PROXY
DOMAIN-SUFFIX,id.auone.jp,PROXY # 用于 au ID 登录/相关功能
DOMAIN-SUFFIX,connect.auone.jp,PROXY # 用于 au ID 相关服务

支付处理
DOMAIN,api-payment.kddi-video.com,PROXY

用户如果使用 Docomo 或 Softbank 等第三方支付方式并遇到问题，可能需要添加针对这些特定支付提供商的规则，但这超出了 Telasa 直接控制的域名范围。
后备/关键字规则 (谨慎使用，置于更具体的规则之后)
DOMAIN-KEYWORD,telasa,PROXY
DOMAIN-KEYWORD,kddi-video,PROXY
DOMAIN-KEYWORD,videopass,PROXY

分析/追踪器 (可选 - 用户自行决定)
DOMAIN-SUFFIX,google-analytics.com,REJECT
DOMAIN-SUFFIX,googletagmanager.com,REJECT
(根据用户偏好从表2添加其他域名)
最终默认规则 (根据用户实际情况调整)
FINAL,DIRECT
此结构提供了一种分层方法：首先是特定的关键域名，然后是更广泛的后缀，最后是作为安全网的关键字。分离分析域名允许用户轻松启用/禁用该部分。`kddi-video.com` 后缀规则由于其功能性子域名数量众多而至关重要 <sup>15</sup>。
</details>
</details>

<details>
<summary>▶ 5. DRM 及流媒体技术考量</summary>

<details>
<summary>▶ 5.1. Telasa 可能使用的 DRM 系统</summary>

鉴于 Telasa 在日本运营并基于现代平台，它无疑会使用多种主流 DRM 技术来保护其内容。这些技术包括：
* Google Widevine: 用于 Chrome 浏览器、Android 设备、Chromecast、Android TV <sup>55</sup>。
* Apple FairPlay: 用于 Safari 浏览器、iOS 设备、Apple TV <sup>57</sup>。
* Microsoft PlayReady: 用于 Edge 浏览器、Windows 设备、Xbox <sup>57</sup>。
这三种 DRM 是实现全面跨平台覆盖的行业标准。理解这些 DRM 正在被使用非常重要，因为成功的播放取决于播放器能否正确地与相应 DRM 的许可证服务器通信。
</details>

<details>
<summary>▶ 5.2. DRM 许可证服务器域名</summary>

在提供的研究资料中，并未明确指出 Telasa 特定的许可证服务器域名。

DRM 许可证请求通常由视频播放器向流媒体清单（例如 DASH 的 MPD，HLS 的 m3u8）中指定的端点发出。此端点通常是流媒体服务本身或专业 DRM 服务提供商托管的 API。

鉴于 KDDI 深度参与 Telasa 的后端运营，许可证获取请求极有可能发往 `api-*.kddi-video.com` 域名之一，或者是 `kddi-video.com` 或 `telasa.jp` 下某个未列出的专用子域名。通用的 DRM 架构 <sup>55</sup> 涉及播放器从许可证服务器请求许可证。关键在于该服务器必须可以访问，并能为地理区域提供有效的许可证。虽然没有特定的 `license.telasa.jp` 或类似域名，但现有的针对 `kddi-video.com` 的 API 规则（尤其是 `api-videopass-playback.kddi-video.com`）很可能覆盖了许可证请求。如果这些 API 调用被正确代理到日本，那么许可证服务器（无论它在该基础设施中的哪个位置）应该会颁发日本有效的许可证。

DRM 不仅用于版权保护，它还是执行内容许可条款（包括地理限制）的关键机制。许可证服务器会在颁发许可证之前检查请求的感知来源（基于 IP 地址）。内容许可是按区域销售的，DRM 系统 <sup>63</sup> 允许服务颁发仅在特定区域内有效的播放许可证，或拒绝来自未经授权区域的请求的许可证。这就是为什么正确代理许可证请求对于绕过地理封锁至关重要的原因。
</details>

<details>
<summary>▶ 5.3. 对代理规则的影响</summary>

通常情况下，对于 DRM 系统本身（如 `*.widevine.com` 或 `*.playready.com`）不需要额外特定的规则，因为这些域名通常提供 DRM 客户端软件或一般信息，而非针对每个流的许可证。许可证获取发生在服务自身的后端。

关键在于确保负责提供视频清单和许可证获取 API 调用的域名（很可能是 `*.kddi-video.com` 和 `d2lmsumy47c8as.cloudfront.net`）被正确地通过日本代理路由。如果核心服务、API 和 CDN 域名被正确代理，DRM 应该能够正常工作，因为许可证服务器会将请求感知为源自日本。
</details>
</details>

<details>
<summary>▶ 6. 规则集维护建议</summary>

<details>
<summary>▶ 6.1. 流媒体服务域名的动态性</summary>

流媒体服务、CDN 和 API 端点可能会随着基础设施更新、新功能或合作伙伴关系的变化而随时间改变。静态规则集最终可能会过时。这是一个重要的免责声明，用户必须理解所提供的规则集是特定时间点的快照。
</details>

<details>
<summary>▶ 6.2. 监控代理日志</summary>

建议用户在使用 Telasa 时检查其代理软件（如 Surge, Clash）的日志。如果 Telasa 加载失败或某些功能损坏，日志可能会显示对未列出域名的请求被阻止或错误路由。

然后可以调查这些未处理的域名并将其添加到规则集中。高级用户也可以使用网络流量分析工具 <sup>48</sup>，但简单的代理日志通常足以识别遗漏的域名。赋予用户自我诊断的能力是长期成功的关键。
</details>

<details>
<summary>▶ 6.3. 查阅社区维护的规则列表</summary>

一些在线社区和 GitHub 存储库共享和更新各种服务的代理规则列表。
此类列表的示例（尽管并非所有列表都包含 Telasa 或都是最新的）：
* `gist.github.com/candyan/67bbda9a0b2ce4310852bcd52ce5deac` <sup>15</sup> - 这是用于识别 Telasa/KDDI 域名的关键来源之一。
* `doc.nfdns.top` / `netflix520.com` <sup>13</sup> - 另一个关键来源。
* GitHub 仓库如 `1-stream/1stream-public-utils` <sup>33</sup> - 这些特定文件在提供的资料中对 Telasa 用处不大，但代表了应寻找的资源类型。
* 日本流媒体服务通用列表 <sup>37</sup>。

用户可以定期检查这些资源以获取更新的 Telasa 规则。利用社区知识是保持规则集最新状态的有效方法。像 <sup>15</sup> 和 <sup>13</sup> 这样的列表的存在表明这是一个活跃的兴趣领域。这些详细的域名列表通常是许多用户观察网络流量并分享其发现的结果。虽然这些列表并非官方，但出于解锁目的，它们可能比从头开始推断所有内容更及时或更全面。
</details>

<details>
<summary>▶ 6.4. 测试与迭代</summary>

对规则集进行任何修改后，对 Telasa 的功能（浏览、搜索、播放、登录、订阅管理（如适用））进行彻底测试至关重要。这强调了对规则维护采取有条不紊方法的重要性。

虽然 `DOMAIN-KEYWORD` 规则可能过于宽泛，但如果它们出现在代理日志中，也可以帮助识别与 Telasa 相关的新子域名。如果 `DOMAIN-KEYWORD,telasa,PROXY` 规则捕获了一个新的、未列出的 `newfeature.telasa.jp`，则表明需要使用针对该新子域名的更精确的 `DOMAIN-SUFFIX` 或 `DOMAIN` 规则来更新特定的规则集。服务是不断发展的，新的子域名可能会出现（例如 `shop.telasa.jp`）。关键字规则会代理它，使服务（大部分）能够工作，并且日志条目会提醒用户添加更具体的规则，从而随着时间的推移完善规则集。
</details>
</details>

<details>
<summary>▶ 结论</summary>

Telasa 的域名和服务架构反映了其作为 KDDI 和朝日电视台合资企业的背景，以及从 Video Pass 品牌重塑而来的历史。其核心功能严重依赖 `kddi-video.com` 的一系列子域名进行 API 通信、认证、支付和部分内容分发，同时利用如亚马逊 CloudFront 这样的第三方 CDN 进行大规模流媒体传输。旧有域名如 `videopass.jp` 依然具有相关性。

本报告提供的分流规则集旨在全面覆盖这些已知域名，确保在日本境外通过代理访问 Telasa 时的功能完整性。规则集区分了核心服务域名（建议通过代理访问）和第三方分析/追踪域名（用户可选择阻止或直接访问）。

鉴于流媒体服务域名的动态特性，持续监控代理日志并参考社区维护的规则列表对于保持规则集的有效性至关重要。用户应理解，所提供的规则集是基于当前可用信息构建的，可能需要根据未来的服务变化进行调整。通过结合精确的规则和定期的维护，用户可以最大限度地提高访问 Telasa 服务的可靠性。
</details>
