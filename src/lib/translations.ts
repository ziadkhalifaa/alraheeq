export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      products: 'منتجاتنا',
      quality: 'الجودة',
      certificates: 'شهاداتنا',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا',
      requestQuote: 'اطلب عرض سعر',
      switchLang: 'English',
    },

    // Home Page
    home: {
      hero: {
        badge: 'منذ مصر إلى العالم',
        title: 'أعشاب وتوابل مصرية',
        titleAccent: 'عالية الجودة',
        titleEnd: 'للأسواق العالمية',
        subtitle: 'في الرحيق هربس ننقل ثراء الزراعة المصرية إلى العملاء حول العالم. من خلال التوريد الموثوق، والتجهيز الدقيق، ومعايير الجودة المناسبة للتصدير.',
        cta1: 'اطلب عرض سعر',
        cta2: 'استكشف المنتجات',
        scroll: 'اكتشف المزيد',
        stat1: 'دولة مصدّر إليها',
        stat2: 'منتج متاح',
        stat3: 'سنوات خبرة',
        stat4: 'عميل موثوق',
      },
      intro: {
        badge: 'قيمتنا',
        title: 'من منشأ مصري',
        titleAccent: 'إلى وجهات عالمية',
        text1: 'نلتزم بتقديم منتجات مصرية طبيعية تلبي احتياجات المستوردين والمصنعين والعملاء الدوليين الباحثين عن الجودة والاعتمادية والخدمة التصديرية الاحترافية.',
        text2: 'شراكات موثوقة مع أفضل المزارعين والموردين المصريين لضمان أعلى معايير الجودة في كل شحنة.',
        feature1: 'مصادر طبيعية 100%',
        feature2: 'رقابة جودة صارمة',
        feature3: 'تصدير احترافي',
        feature4: 'شراكات طويلة الأمد',
      },
      process: {
        badge: 'آلية العمل',
        title: 'من المصدر',
        titleAccent: 'إلى الشحنة',
        step1Title: 'التوريد الانتقائي',
        step1Text: 'نتعاون مع مزارعين وموردين موثوقين لتوفير أعشاب وتوابل وبذور وخضروات مجففة بجودة مناسبة لمتطلبات التصدير.',
        step2Title: 'الفحص وضمان الجودة',
        step2Text: 'يتم التعامل مع كل دفعة بعناية مع التركيز على النظافة والثبات ومطابقة مواصفات العميل.',
        step3Title: 'التصدير والتسليم',
        step3Text: 'نجهز الشحنات باحترافية من خلال تنسيق دقيق، ومستندات منظمة، وخدمات لوجستية فعالة لضمان تسليم دولي سلس.',
      },
      why: {
        badge: 'لماذا نحن',
        title: 'لماذا',
        titleAccent: 'الرحيق هربس',
        r1Title: 'جودة موثوقة',
        r1Text: 'نركز على تقديم منتجات بمعايير ثابتة وجاهزية عالية للتصدير.',
        r2Title: 'شبكة توريد قوية',
        r2Text: 'علاقاتنا القوية مع مصادر التوريد تساعدنا على تأمين خامات متميزة والحفاظ على استقرار الإمداد.',
        r3Title: 'دعم تصديري احترافي',
        r3Text: 'نفهم متطلبات التجارة الدولية ونعمل على تقديم تجربة تصدير منظمة وموثوقة.',
        r4Title: 'شراكات طويلة الأمد',
        r4Text: 'نؤمن أن العلاقات التجارية الناجحة تُبنى على الثقة والوضوح والاستمرارية في الأداء.',
      },
      categories: {
        badge: 'أبرز الفئات',
        title: 'فئاتنا',
        titleAccent: 'الرئيسية',
        herbs: 'الأعشاب والمنقوعات',
        herbsDesc: 'أعشاب مصرية طبيعية بجودة تصديرية عالية',
        seeds: 'البذور',
        seedsDesc: 'بذور مختارة بعناية تلبيةً لمتطلبات الأسواق',
        spices: 'التوابل',
        spicesDesc: 'توابل مصرية بلون ورائحة وجودة استثنائية',
        dehydrated: 'الخضروات المجففة',
        dehydratedDesc: 'خضروات مجففة للصناعة والتجارة الدولية',
        viewAll: 'عرض جميع المنتجات',
      },
      testimonials: {
        badge: 'آراء العملاء',
        title: 'ماذا يقول',
        titleAccent: 'عملاؤنا',
      },
      cta: {
        badge: 'ابدأ معنا',
        title: 'هل تبحث عن شريك تصدير',
        titleAccent: 'مصري موثوق؟',
        text: 'دع الرحيق هربس يدعم أعمالك بمنتجات طبيعية متميزة وخدمة تصدير يمكن الاعتماد عليها.',
        btn: 'تواصل معنا',
        btn2: 'استكشف المنتجات',
      },
    },

    // About
    about: {
      hero: {
        badge: 'تعرف علينا',
        title: 'عن',
        titleAccent: 'الرحيق هربس',
      },
      intro: {
        text1: 'الرحيق هربس شركة مصرية متخصصة في تصدير الأعشاب والتوابل والبذور والخضروات المجففة إلى الأسواق الدولية.',
        text2: 'نلتزم بتقديم منتجات طبيعية بجودة موثوقة، مع بناء شراكات قوية مع العملاء الذين يقدّرون الاستمرارية والاحترافية وحسن الخدمة.',
        text3: 'نؤمن أن نجاح التصدير يبدأ من المصدر الصحيح، لذلك نولي اهتمامًا كبيرًا باختيار المنتج والتعامل معه وتجهيزه في كل مرحلة من مراحل التوريد.',
      },
      vision: {
        badge: 'رؤيتنا',
        title: 'رؤيتنا',
        text: 'أن نصبح اسمًا موثوقًا في سوق الأعشاب والتوابل العالمي من خلال تقديم منتجات مصرية عالية الجودة باحترافية وثبات واهتمام بالتفاصيل.',
      },
      mission: {
        badge: 'رسالتنا',
        title: 'رسالتنا',
        text: 'ربط قيمة الزراعة المصرية بالأسواق العالمية من خلال التوريد الموثوق، والرقابة الدقيقة على الجودة، والحلول التصديرية الموجهة لاحتياجات العملاء.',
      },
      values: {
        badge: 'قيمنا',
        title: 'قيمنا',
        v1: 'الجودة',
        v2: 'الثقة',
        v3: 'الشفافية',
        v4: 'الالتزام',
        v5: 'الشراكة طويلة المدى',
      },
      stats: {
        s1: 'دولة',
        s1Label: 'أسواق تصدير',
        s2: '+50',
        s2Label: 'منتج',
        s3: 'مصر',
        s3Label: 'المنشأ',
        s4: '100%',
        s4Label: 'طبيعي',
      },
    },

    // Products
    products: {
      hero: {
        badge: 'منتجاتنا',
        title: 'منتجات مصرية متميزة',
        titleAccent: 'للأسواق الدولية',
        subtitle: 'في الرحيق هربس نقدم مجموعة مختارة من المنتجات الطبيعية المصرية التي يتم تجهيزها بعناية لتلبية احتياجات الأسواق المختلفة.',
      },
      filter: {
        all: 'جميع المنتجات',
        herbs: 'الأعشاب',
        seeds: 'البذور',
        spices: 'التوابل',
        dehydrated: 'الخضروات المجففة',
      },
      cta: {
        title: 'للحصول على قائمة المنتجات والمواصفات وعروض الأسعار',
        subtitle: 'يرجى التواصل مع فريقنا مباشرة.',
        btn: 'تواصل معنا',
      },
      herbs: {
        title: 'الأعشاب والمنقوعات',
        desc: 'مجموعة واسعة من الأعشاب المصرية المعروفة بجودتها الطبيعية ورائحتها المميزة وملاءمتها للتصدير.',
      },
      seeds: {
        title: 'البذور',
        desc: 'بذور يتم توريدها مع الاهتمام بالجودة والنظافة ومطابقة متطلبات العميل.',
      },
      spices: {
        title: 'التوابل',
        desc: 'توابل مصرية عالية الجودة مع التركيز على اللون والرائحة والمظهر العام.',
      },
      dehydrated: {
        title: 'الخضروات المجففة',
        desc: 'خضروات مجففة يتم اختيارها وتجهيزها لتناسب احتياجات مصانع الأغذية والتجار.',
      },
    },

    // Quality
    quality: {
      hero: {
        badge: 'التزامنا',
        title: 'الجودة في',
        titleAccent: 'كل مرحلة',
        subtitle: 'في الرحيق هربس لا تقتصر الجودة على المنتج النهائي فقط، بل تشمل كل خطوة من خطوات العمل.',
      },
      intro: 'نحن ملتزمون بتقديم منتجات تلبي توقعات العملاء وتدعم متطلبات الأسواق الدولية. ونحن ندرك أن الثبات في الجودة عنصر أساسي.',
      safety: {
        badge: 'سلامة الغذاء',
        title: 'التزام قوي بسلامة الغذاء',
        text: 'تمثل سلامة الغذاء جزءًا أساسيًا من عملية التصدير لدينا. ونعمل من خلال ضوابط واضحة وتعامل احترافي لدعم تقديم منتجات آمنة ومتوافقة وجاهزة للأسواق المختلفة.',
      },
      control: {
        badge: 'مراقبة الجودة',
        title: 'مراجعة دقيقة وتقييم مستمر للمنتج',
        text: 'تعتمد منهجيتنا في مراقبة الجودة على فحص كل دفعة وفقًا للمتطلبات المتفق عليها وتوقعات التصدير، بهدف تقديم منتج ثابت الجودة واحترافي.',
      },
      sampling: {
        badge: 'الفحص',
        title: 'اهتمام بالتفاصيل في كل دفعة',
        text: 'نؤمن أن الدقة في الفحص ومراجعة المنتج عنصر أساسي للحفاظ على الثبات وبناء ثقة العملاء، لذلك يتم التعامل مع كل طلب بعناية.',
      },
    },

    // Certificates
    certificates: {
      hero: {
        badge: 'الشهادات والامتثال',
        title: 'ثقة في التصدير',
        titleAccent: 'مدعومة بمعايير احترافية',
      },
      intro: 'في الرحيق هربس ندرك أهمية الامتثال والمستندات في التجارة الدولية. لذلك نلتزم بدعم متطلبات العملاء من خلال التعامل الاحترافي مع المنتجات.',
      text: 'نعمل بما يدعم توقعات الأسواق الدولية من حيث الجودة وسلامة المنتج وتنظيم المستندات التصديرية بشكل احترافي.',
      commitment: 'هدفنا هو منح عملائنا الثقة والاطمئنان من خلال تجهيز كل شحنة بعناية ووضوح وجاهزية كاملة للتصدير.',
    },

    // FAQ
    faq: {
      hero: {
        badge: 'مساعدة',
        title: 'الأسئلة',
        titleAccent: 'الشائعة',
      },
      q1: 'ما المنتجات التي تقومون بتصديرها؟',
      a1: 'نقوم بتصدير الأعشاب والتوابل والبذور والخضروات المجففة من مصر إلى الأسواق الدولية.',
      q2: 'كيف تحافظون على جودة المنتجات؟',
      a2: 'نتبع عملية دقيقة تشمل التوريد والتعامل مع المنتج ومراجعته وتجهيزه للتصدير بما يساعد على الحفاظ على الجودة والثبات.',
      q3: 'هل يمكن التوريد وفقًا لمواصفات العميل؟',
      a3: 'نعم، نعمل على تلبية متطلبات العملاء ومواصفاتهم كلما كان ذلك ممكنًا.',
      q4: 'هل توفرون مستندات التصدير وتنسيق الشحنات؟',
      a4: 'نعم، نقوم بتجهيز وتنسيق متطلبات التصدير وفقًا لطبيعة الطلب والوجهة المستهدفة.',
      q5: 'ما مدة التنفيذ المعتادة؟',
      a5: 'تعتمد مدة التنفيذ على نوع المنتج والكمية والوجهة، مع حرصنا الدائم على سرعة التجهيز والالتزام في التسليم.',
      q6: 'ما هي الحد الأدنى لكميات الطلب؟',
      a6: 'تتفاوت الكميات الدنيا حسب نوع المنتج. يرجى التواصل مع فريقنا للحصول على معلومات تفصيلية وفقًا لاحتياجاتكم.',
    },

    // Contact
    contact: {
      hero: {
        badge: 'تواصل معنا',
        title: 'لنبدأ',
        titleAccent: 'شراكة ناجحة',
        subtitle: 'نحن مستعدون لدعم احتياجاتكم من الأعشاب والتوابل والبذور والخضروات المجففة المصرية عالية الجودة.',
      },
      info: {
        company: 'الرحيق هربس',
        country: 'مصر',
        address: 'بني سويف - مركز سمسطا - منشأة أبو مليح',
        email: 'info@alraheeqherbs.com',
        phone: '+20 1010213937',
        whatsapp: 'تواصل عبر واتساب',
      },
      form: {
        title: 'أرسل استفساراتك',
        name: 'الاسم الكامل',
        namePlaceholder: 'أدخل اسمك الكامل',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'example@company.com',
        phone: 'رقم الهاتف',
        phonePlaceholder: '+20 ...',
        company: 'اسم الشركة',
        companyPlaceholder: 'اسم شركتك',
        product: 'المنتج المطلوب',
        productPlaceholder: 'أعشاب، توابل، بذور...',
        message: 'تفاصيل الاستفسار',
        messagePlaceholder: 'اكتب تفاصيل طلبك أو استفسارك...',
        submit: 'إرسال الطلب',
        sending: 'جارٍ الإرسال...',
        success: 'تم إرسال استفساركم بنجاح! سنتواصل معكم قريباً.',
      },
      cta: {
        title: 'تواصل مع فريقنا للحصول على عروض الأسعار وتفاصيل المنتجات والاستفسارات التصديرية.',
        btn: 'اطلب عرض سعر',
      },
    },

    // Footer
    footer: {
      tagline: 'أعشاب وتوابل مصرية للأسواق العالمية',
      links: 'روابط سريعة',
      products: 'المنتجات',
      contact: 'تواصل معنا',
      rights: '© 2025 الرحيق هربس. جميع الحقوق محفوظة.',
    },
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Products',
      quality: 'Quality',
      certificates: 'Certificates',
      faq: 'FAQ',
      contact: 'Contact',
      requestQuote: 'Request a Quote',
      switchLang: 'عربي',
    },

    // Home Page
    home: {
      hero: {
        badge: 'From Egypt to the World',
        title: 'Premium Egyptian',
        titleAccent: 'Herbs & Spices',
        titleEnd: 'for Global Markets',
        subtitle: 'At Alraheeq Herbs, we deliver the richness of Egyptian agriculture to customers around the world through trusted sourcing, careful processing, and export-focused quality standards.',
        cta1: 'Request a Quote',
        cta2: 'Explore Products',
        scroll: 'Discover More',
        stat1: 'Export Countries',
        stat2: 'Products Available',
        stat3: 'Years Experience',
        stat4: 'Trusted Clients',
      },
      intro: {
        badge: 'Our Value',
        title: 'From Egyptian Origin to',
        titleAccent: 'International Destination',
        text1: 'We are committed to supplying natural Egyptian products that meet the expectations of importers, manufacturers, and global buyers seeking quality, reliability, and professional export service.',
        text2: 'Trusted partnerships with the finest Egyptian farmers and suppliers to ensure the highest quality standards in every shipment.',
        feature1: '100% Natural Sources',
        feature2: 'Strict Quality Control',
        feature3: 'Professional Export',
        feature4: 'Long-Term Partnerships',
      },
      process: {
        badge: 'Our Process',
        title: 'From Source',
        titleAccent: 'to Shipment',
        step1Title: 'Selective Sourcing',
        step1Text: 'We work with trusted growers and suppliers to source high-quality herbs, spices, seeds, and dehydrated vegetables that meet export requirements.',
        step2Title: 'Inspection & Quality Assurance',
        step2Text: 'Each batch is reviewed and handled with attention to cleanliness, consistency, and compliance with customer specifications.',
        step3Title: 'Export & Delivery',
        step3Text: 'We prepare shipments with professional coordination, reliable documentation, and efficient logistics to support smooth international delivery.',
      },
      why: {
        badge: 'Why Us',
        title: 'Why',
        titleAccent: 'Alraheeq Herbs',
        r1Title: 'Reliable Quality',
        r1Text: 'We focus on supplying products with consistent standards and dependable export readiness.',
        r2Title: 'Trusted Supply Network',
        r2Text: 'Our strong sourcing relationships help us secure premium raw materials and maintain stable supply.',
        r3Title: 'Professional Export Support',
        r3Text: 'We understand international business requirements and aim to deliver a smooth and reliable export experience.',
        r4Title: 'Long-Term Partnerships',
        r4Text: 'We believe strong business relationships are built on trust, transparency, and consistent performance.',
      },
      categories: {
        badge: 'Featured Categories',
        title: 'Our Main',
        titleAccent: 'Product Categories',
        herbs: 'Herbs & Infusions',
        herbsDesc: 'Premium Egyptian herbs with export-grade natural quality',
        seeds: 'Seeds',
        seedsDesc: 'Carefully selected seeds meeting market requirements',
        spices: 'Spices',
        spicesDesc: 'Egyptian spices with exceptional color, aroma and quality',
        dehydrated: 'Dehydrated Vegetables',
        dehydratedDesc: 'Dried vegetables for industry and international trade',
        viewAll: 'View All Products',
      },
      testimonials: {
        badge: 'Client Reviews',
        title: 'What Our',
        titleAccent: 'Clients Say',
      },
      cta: {
        badge: 'Get Started',
        title: 'Looking for a Reliable',
        titleAccent: 'Egyptian Export Partner?',
        text: "Let Alraheeq Herbs support your business with premium natural products and dependable export service.",
        btn: 'Contact Us',
        btn2: 'Explore Products',
      },
    },

    // About
    about: {
      hero: {
        badge: 'Get to Know Us',
        title: 'About',
        titleAccent: 'Alraheeq Herbs',
      },
      intro: {
        text1: 'Alraheeq Herbs is an Egyptian company specialized in exporting herbs, spices, seeds, and dehydrated vegetables to international markets.',
        text2: 'We are dedicated to offering natural products of dependable quality while building strong partnerships with clients who value consistency, service, and professionalism.',
        text3: 'We believe that successful export begins with the right source. That is why we pay close attention to product selection, handling, and preparation at every stage of the supply process.',
      },
      vision: {
        badge: 'Our Vision',
        title: 'Our Vision',
        text: 'To become a trusted name in the global herbs and spices industry by delivering quality Egyptian products with professionalism, consistency, and care.',
      },
      mission: {
        badge: 'Our Mission',
        title: 'Our Mission',
        text: 'To connect the value of Egyptian agriculture with international markets through reliable sourcing, careful quality control, and customer-focused export solutions.',
      },
      values: {
        badge: 'Our Values',
        title: 'Our Values',
        v1: 'Quality',
        v2: 'Trust',
        v3: 'Transparency',
        v4: 'Commitment',
        v5: 'Long-Term Partnership',
      },
      stats: {
        s1: 'Countries',
        s1Label: 'Export Markets',
        s2: '50+',
        s2Label: 'Products',
        s3: 'Egypt',
        s3Label: 'Origin',
        s4: '100%',
        s4Label: 'Natural',
      },
    },

    // Products
    products: {
      hero: {
        badge: 'Our Products',
        title: 'Premium Egyptian Products',
        titleAccent: 'for International Markets',
        subtitle: 'At Alraheeq Herbs, we offer a carefully selected portfolio of Egyptian natural products prepared to meet diverse market needs and customer requirements.',
      },
      filter: {
        all: 'All Products',
        herbs: 'Herbs',
        seeds: 'Seeds',
        spices: 'Spices',
        dehydrated: 'Dehydrated Vegetables',
      },
      cta: {
        title: 'For product lists, specifications, and quotations',
        subtitle: 'please contact our team directly.',
        btn: 'Contact Us',
      },
      herbs: {
        title: 'Herbs & Infusions',
        desc: 'Wide range of Egyptian herbs known for their natural aroma, purity, and export quality.',
      },
      seeds: {
        title: 'Seeds',
        desc: 'Seeds sourced with attention to quality, cleanliness, and customer specifications.',
      },
      spices: {
        title: 'Spices',
        desc: 'Premium Egyptian spices with careful attention to color, aroma, appearance, and export suitability.',
      },
      dehydrated: {
        title: 'Dehydrated Vegetables',
        desc: 'Selected and prepared to meet the needs of food processors, traders, and global buyers.',
      },
    },

    // Quality
    quality: {
      hero: {
        badge: 'Our Commitment',
        title: 'Quality at',
        titleAccent: 'Every Step',
        subtitle: 'At Alraheeq Herbs, quality is not limited to the final product. It is part of every stage, from sourcing and selection to preparation and export handling.',
      },
      intro: 'We are committed to supplying products that meet customer expectations and support international market standards. We understand that consistency matters.',
      safety: {
        badge: 'Food Safety',
        title: 'A Strong Commitment to Food Safety',
        text: 'Food safety is an essential part of our export process. We work with careful control and professional handling to support safe, compliant, and market-ready products across our supply chain.',
      },
      control: {
        badge: 'Quality Control',
        title: 'Careful Review and Product Evaluation',
        text: 'Our quality control approach is based on checking each batch against agreed requirements and export expectations. We aim to deliver products with dependable consistency and professional presentation.',
      },
      sampling: {
        badge: 'Inspection',
        title: 'Attention to Detail from Batch to Batch',
        text: 'We believe that accurate inspection and product review are essential for maintaining consistency and customer confidence. Each order is handled with care and attention to required standards.',
      },
    },

    // Certificates
    certificates: {
      hero: {
        badge: 'Certificates & Compliance',
        title: 'Export Confidence',
        titleAccent: 'Backed by Professional Standards',
      },
      intro: 'At Alraheeq Herbs, we understand the importance of compliance and documentation in international trade. We are committed to supporting customer requirements through professional product handling.',
      text: 'We work to support international expectations related to quality, safety, and professional export documentation.',
      commitment: 'Our goal is to provide confidence to our clients by ensuring that every shipment is prepared with care, clarity, and export readiness.',
    },

    // FAQ
    faq: {
      hero: {
        badge: 'Help Center',
        title: 'Frequently Asked',
        titleAccent: 'Questions',
      },
      q1: 'What products do you export?',
      a1: 'We export Egyptian herbs, spices, seeds, and dehydrated vegetables prepared for international markets.',
      q2: 'How do you maintain product quality?',
      a2: 'We follow a careful process that includes sourcing, handling, product review, and export preparation to support consistency and quality.',
      q3: 'Can you supply based on customer specifications?',
      a3: 'Yes, we work to align our products with customer requirements whenever possible.',
      q4: 'Do you support export documents and shipment coordination?',
      a4: 'Yes, we prepare and coordinate export requirements according to the order and destination needs.',
      q5: 'What is your lead time?',
      a5: 'Lead time depends on the product, quantity, and destination. We always aim for efficient preparation and timely delivery.',
      q6: 'What are your minimum order quantities?',
      a6: 'Minimum quantities vary by product type. Please contact our team for detailed information based on your specific needs.',
    },

    // Contact
    contact: {
      hero: {
        badge: 'Reach Out',
        title: "Let's Build",
        titleAccent: 'Business Together',
        subtitle: 'We are ready to support your sourcing needs with premium Egyptian herbs, spices, seeds, and dehydrated vegetables.',
      },
      info: {
        company: 'Alraheeq Herbs',
        country: 'Egypt',
        address: 'Beni Suef - Samasṭa Center - Mansha Abu Milih',
        email: 'info@alraheeqherbs.com',
        phone: '+20 1010213937',
        whatsapp: 'Chat on WhatsApp',
      },
      form: {
        title: 'Send Your Inquiry',
        name: 'Full Name',
        namePlaceholder: 'Enter your full name',
        email: 'Email Address',
        emailPlaceholder: 'example@company.com',
        phone: 'Phone Number',
        phonePlaceholder: '+1 ...',
        company: 'Company Name',
        companyPlaceholder: 'Your company name',
        product: 'Product of Interest',
        productPlaceholder: 'Herbs, spices, seeds...',
        message: 'Inquiry Details',
        messagePlaceholder: 'Write your inquiry details or requirements...',
        submit: 'Send Request',
        sending: 'Sending...',
        success: 'Your inquiry has been sent successfully! We will contact you soon.',
      },
      cta: {
        title: 'Get in touch with our team for quotations, product details, and export inquiries.',
        btn: 'Get a Quote',
      },
    },

    // Footer
    footer: {
      tagline: 'Egyptian Herbs & Spices for Global Markets',
      links: 'Quick Links',
      products: 'Products',
      contact: 'Contact',
      rights: '© 2025 Alraheeq Herbs. All rights reserved.',
    },
  }
};

export type TranslationKeys = typeof translations.ar;
