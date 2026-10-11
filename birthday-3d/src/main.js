// ============================================================
// زادروز — افسانه‌ی لیان
// مرحله: ساخت محیط کوهستانی
//
// وضعیت فعلی:
// ☀️ نسخه‌ی روز روشن برای بررسی شکل واقعی محیط
//
// اصلاحات این مرحله:
// 1. هر کوه یک گروه مستقل است.
// 2. هر کوه می‌تواند حول محور عمودی خودش بچرخد.
// 3. مختصات هندسی کوه محلی شده تا چرخش صحیح باشد.
// 4. محدوده دید دوربین افزایش یافته است.
// 5. مه صحنه ضعیف شده تا کوه‌ها در فاصله زیاد ناپدید نشوند.
// 6. صفحه زمین کنترل شده تا ظاهر «سطح آبی» ایجاد نکند.
// ============================================================

import * as THREE from
    'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';


// ============================================================
// 1) اتصال به صفحه
// ============================================================

const app =
    document.getElementById('app');


// ============================================================
// 2) رنگ آسمان
// ============================================================

const SKY_COLOR =
    0x87CEEB;


// ============================================================
// 3) ساخت صحنه
// ============================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        SKY_COLOR
    );


// ============================================================
// 4) مه
//
// مه را خیلی ضعیف کرده‌ایم.
// در فاصله‌های زیاد، مه قبلی باعث می‌شد
// کوه‌ها تقریباً در آسمان محو شوند.
// ============================================================

scene.fog =
    new THREE.FogExp2(
        SKY_COLOR,
        0.000015
    );


// ============================================================
// 5) دوربین
//
// far قبلاً 10000 بود.
// وقتی از کوه‌ها خیلی دور می‌شدیم، بخش‌هایی
// از جهان از محدوده دید دوربین خارج می‌شدند.
//
// اکنون محدوده دید بسیار بزرگ‌تر است.
// ============================================================

const camera =
    new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
        window.innerHeight,
        0.1,
        100000
    );


// ============================================================
// 6) موقعیت اولیه دوربین
// ============================================================

camera.position.set(
    0,
    1500,
    2000
);

camera.rotation.set(
    -0.10,
    0,
    0
);


// ============================================================
// 7) Renderer
// ============================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance'
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.shadowMap.enabled =
    true;

app.appendChild(
    renderer.domElement
);


// ============================================================
// 8) نور محیط
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        2.2
    );

scene.add(
    ambientLight
);


// ============================================================
// 9) نور خورشید
// ============================================================

const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        3.0
    );

sunLight.position.set(
    -800,
    1200,
    500
);

sunLight.castShadow =
    true;

scene.add(
    sunLight
);


// ============================================================
// 10) دو صفحه‌ی اصلی محیط
//
// در این مرحله زمین پیچیده نداریم.
// دو صفحه‌ی ساده فقط برای ساخت بستر محیط استفاده می‌شوند.
//
// صفحه اول:
// بخش اصلی محیط و محل قرارگیری روستاها
//
// صفحه دوم:
// بخش دورتر محیط و فضای طبیعی
// ============================================================


// ============================================================
// صفحه اول — محیط اصلی
// ============================================================

const mainGroundGeometry =
    new THREE.PlaneGeometry(
        20000,
        9500,
        1000,
        100
    );


// ============================================================
// پستی و بلندی منطقه جلوی کوه
//
// این ناهمواری فقط روی mainGround ایجاد می‌شود.
// بخش‌های دیگر زمین فعلاً صاف باقی می‌مانند.
// ============================================================

const mainGroundPositions =
    mainGroundGeometry.attributes.position;


for (
    let i = 0;
    i < mainGroundPositions.count;
    i++
) {

    const x =
        mainGroundPositions.getX(i);

    const z =
        -mainGroundPositions.getY(i);


    // --------------------------------------------------------
    // منطقه ناهموار
    //
    // این منطقه در بخش بالایی mainGround قرار دارد؛
    // یعنی نزدیک‌تر به کوه اصلی.
    // --------------------------------------------------------

    const mountainZone =
        z > 1800;


    if (
        mountainZone
    ) {

        // موج بزرگ و نرم
        const largeWave =
            Math.sin(
                x * 0.004
            ) *
            Math.cos(
                z * 0.005
            ) *
            120;


        // موج دوم برای طبیعی‌تر شدن سطح
        const mediumWave =
            Math.sin(
                x * 0.011 +
                z * 0.008
            ) *
            45;


        // موج کوچک
        const smallWave =
            Math.sin(
                x * 0.025 +
                z * 0.018
            ) *
            12;


        const height =
            largeWave +
            mediumWave +
            smallWave;


        mainGroundPositions.setZ(
            i,
            height
        );
    }
}

// ============================================================
// محاسبه Normalها بعد از ایجاد پستی و بلندی
// ============================================================

mainGroundGeometry.computeVertexNormals();

// ============================================================
// ساخت صفحه اصلی محیط
// ============================================================

const mainGroundMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x32CD32,

        roughness: 1,

        metalness: 0,

        side:
            THREE.DoubleSide
    });


const mainGround =
    new THREE.Mesh(
        mainGroundGeometry,
        mainGroundMaterial
    );


// تبدیل صفحه به سطح XZ
mainGround.rotation.x =
    -Math.PI / 2;


// دریافت سایه کوه‌ها و سایر اجسام
mainGround.receiveShadow =
    true;


// اضافه کردن صفحه اصلی به صحنه
scene.add(
    mainGround
);

// ============================================================
// صفحه دوم — محیط نزدیک
// ============================================================

const frontGroundGeometry =
    new THREE.PlaneGeometry(
        22000,
        10500
    );


const frontGroundMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x32CD32,

        roughness: 1,

        metalness: 0,

        side:
            THREE.DoubleSide
    });


const frontGround =
    new THREE.Mesh(
        frontGroundGeometry,
        frontGroundMaterial
    );


// تبدیل صفحه به سطح XZ
frontGround.rotation.x =
    -Math.PI / 2;


// صفحه دوم کمی جلو‌تر قرار می‌گیرد.
frontGround.position.set(
    0,
    0,
    10000
);


frontGround.receiveShadow =
    true;


scene.add(
    frontGround
);


 // ============================================================
 // زمین‌های مستقل سه محله و میدان مرکزی
 // فعلاً همه‌ی سطوح صاف هستند؛ ناهمواری مستقل را بعداً می‌سازیم.
 // ============================================================

// تابع ساخت یک سطح مستقل روی زمین
function createVillageGround({
    x,
    z,
    width,
    depth,
    color
}) {
    const geometry =
        new THREE.PlaneGeometry(
            width,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide
        });

    const ground =
        new THREE.Mesh(
            geometry,
            material
        );

    // تبدیل صفحه به سطح افقی
    ground.rotation.x =
        -Math.PI / 2;

    // قرارگیری سطح در مختصات انتخاب‌شده
    ground.position.set(
        x,
        2,
        z
    );

    ground.receiveShadow =
        true;

    scene.add(ground);

    return ground;
}



// ------------------------------------------------------------
// میدان مرکزی: فضای خالی میان محله‌ها
// ------------------------------------------------------------

const centralSquareGround =
    createVillageGround({
        x: -600,
        z: 6500,
        width: 2700,
        depth: 1000,
        color: 0xFFFFFF
    });

    // زمین مستقل برای منطقه رودخانه و جنگل
const forestGroundGeometry = new THREE.PlaneGeometry(12000, 3500);

const forestGroundMaterial = new THREE.MeshStandardMaterial({
    color: 0x310000,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide
});

const forestGround = new THREE.Mesh(
    forestGroundGeometry,
    forestGroundMaterial
);

forestGround.rotation.x = -Math.PI / 2;
forestGround.position.set(-1000, 0, 8700);
forestGround.receiveShadow = true;

scene.add(forestGround);



/**
 * ساخت چمن سه‌بعدی سبک با InstancedMesh
 * چمن‌ها در محدوده خانه‌ها و جاده‌ها قرار نمی‌گیرند.
 */
function createGrassBlades({
    x,
    z,
    width,
    depth,
    houses = [],
    count = 600
}) {
    const bladeGeometry = new THREE.PlaneGeometry(4, 14);

    const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0x83B94F,
        side: THREE.DoubleSide,
        roughness: 1
    });

    const grass = new THREE.InstancedMesh(
        bladeGeometry,
        bladeMaterial,
        count
    );

    const dummy = new THREE.Object3D();
    const bladeColor = new THREE.Color();

    let placed = 0;
    let attempts = 0;
    const maxAttempts = count * 8;

    while (placed < count && attempts < maxAttempts) {
        attempts++;

        const px = x + (Math.random() - 0.5) * width;
        const pz = z + (Math.random() - 0.5) * depth;

        // خالی نگه داشتن اطراف خانه‌ها
        const nearHouse = houses.some(house =>
            Math.abs(px - house.position.x) < 155 &&
            Math.abs(pz - house.position.z) < 155
        );

        if (nearHouse) continue;

        // فاصله از جاده‌های عمودی
        const nearVerticalRoad =
            (Math.abs(px + 2000) < 95 ||
             Math.abs(px - 1000) < 95) &&
            pz > 4900 &&
            pz < 7250;

        // فاصله از جاده اصلی افقی
        const nearMainRoad = Math.abs(pz - 7100) < 110;

        if (nearVerticalRoad || nearMainRoad) continue;

        const height = 0.65 + Math.random() * 0.7;

        dummy.position.set(
            px,
            2.4 + 7 * height,
            pz
        );

        // صفحه چمن عمودی می‌ماند؛ فقط حول محور Y می‌چرخد.
        dummy.rotation.set(
            0,
            Math.random() * Math.PI,
            0
        );

        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();

        grass.setMatrixAt(placed, dummy.matrix);

        bladeColor.setHSL(
            0.25 + Math.random() * 0.06,
            0.45 + Math.random() * 0.2,
            0.35 + Math.random() * 0.2
        );

        grass.setColorAt(placed, bladeColor);

        placed++;
    }

    // تعداد واقعی تیغه‌های ساخته‌شده
    grass.count = placed;
    grass.instanceMatrix.needsUpdate = true;

    if (grass.instanceColor) {
        grass.instanceColor.needsUpdate = true;
    }

    scene.add(grass);

    return grass;
}


/**
 * ساخت یک خانه روستایی سه‌بعدی
 * تمام مختصات نسبت به مرکز خانه هستند.
 */
function createHouse({
    x = 0,
    z = 0,
    width = 100,
    height = 90,
    depth = 90,
    wallColor = 0xD8C09A,
    roofColor = 0x78452D,
    rotation = 0,
    hasPorch = false,
    floors = 1
} = {}) {
    const house = new THREE.Group();

    // ارتفاع هر طبقه بر اساس تعداد طبقات خانه
    const floorHeight = height / floors;

    // بدنه خانه

    // بدنه کاه‌گلی خانه با تغییرات طبیعی و ملایم رنگ
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);

    const wallMaterial = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 1,
        metalness: 0
    });

    // تغییر بسیار ملایم رنگ برای جلوگیری از یکدست شدن روستا
    wallMaterial.color.offsetHSL(
        0,
        (Math.random() - 0.5) * 0.035,
        (Math.random() - 0.5) * 0.06
    );

    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = height / 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    house.add(walls);


    // بافت برجسته و واضح روی نمای جلویی خانه کاه‌گلی
    const plasterMaterial = new THREE.MeshStandardMaterial({
        color: 0xBDA27C,
        roughness: 1,
        metalness: 0
    });

    const plasterRows = 9;
    const plasterColumns = 12;
    const patchDepth = 2;

    for (let row = 0; row < plasterRows; row++) {
        for (let col = 0; col < plasterColumns; col++) {
            // فاصله‌های نامنظم برای شبیه شدن به سطح کاه‌گل
            const patchWidth = width / plasterColumns * 0.72;
            const patchHeight = height / plasterRows * 0.42;

            const patch = new THREE.Mesh(
                new THREE.BoxGeometry(
                    patchWidth,
                    patchHeight,
                    patchDepth
                ),
                plasterMaterial
            );

            patch.position.set(
                -width / 2 +
                    (col + 0.5) * (width / plasterColumns),
                (row + 0.5) * (height / plasterRows),
                depth / 2 + patchDepth / 2 + 0.2
            );

            house.add(patch);
        }
    }

    // پایه سنگی زیر دیوارهای خانه
    const foundationGeometry = new THREE.BoxGeometry(
        width + 8,
        height * 0.12,
        depth + 8
    );

    // سنگ‌های پایه خانه با رنگ خاکستری گرم
    const foundationMaterial = new THREE.MeshStandardMaterial({
        color: 0x918779,
        roughness: 1,
        metalness: 0
    });

    const foundation = new THREE.Mesh(
        foundationGeometry,
        foundationMaterial
    );

    foundation.position.y = height * 0.06;
    foundation.castShadow = true;
    foundation.receiveShadow = true;

    house.add(foundation);


    // سقف سفالی شیب‌دار با کاشی‌های برجسته
    const roofHeight = floorHeight * 0.48;
    const roofOverhang = width * 0.12;
    const roofHalfWidth = width / 2 + roofOverhang;
    const roofHalfDepth = depth / 2 + roofOverhang;
    const ridgeY = height + roofHeight;

    // متریال پایه سقف
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide
    });

    // ساخت دو سطح اصلی سقف
    function createRoofSide(vertices) {
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        geometry.setIndex([0, 1, 2, 0, 2, 3]);
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, roofMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    const leftRoof = createRoofSide([
        -roofHalfWidth, height, -roofHalfDepth,
         0, ridgeY, -roofHalfDepth,
         0, ridgeY,  roofHalfDepth,
        -roofHalfWidth, height, roofHalfDepth
    ]);

    const rightRoof = createRoofSide([
         0, ridgeY, -roofHalfDepth,
         roofHalfWidth, height, -roofHalfDepth,
         roofHalfWidth, height, roofHalfDepth,
         0, ridgeY, roofHalfDepth
    ]);

    house.add(leftRoof);
    house.add(rightRoof);

    // متریال کاشی‌های سفالی
    const tileColors = [
        0xA94F32,
        0xBD6541,
        0x99442F,
        0xC0784B,
        0xAE5939
    ];

    const tileMaterials = tileColors.map(color =>
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.92,
            metalness: 0
        })
    );

    // محاسبه ارتفاع سطح شیب‌دار در هر نقطه از عرض سقف
    function getRoofY(x) {
        const slope = Math.abs(x) / roofHalfWidth;
        return ridgeY - slope * roofHeight;
    }

    // کاشی‌های برجسته روی هر دو سطح سقف
    const tileWidth = Math.max(12, width * 0.105);
    const tileLength = Math.max(18, depth * 0.15);
    const tileThickness = Math.max(2.5, width * 0.014);
    const tileRows = Math.max(
        4,
        Math.ceil((roofHalfDepth * 2) / tileLength)
    );
    const tileColumns = Math.max(
        5,
        Math.ceil(roofHalfWidth / tileWidth)
    );

    for (const side of [-1, 1]) {
        for (let col = 0; col < tileColumns; col++) {
            const distanceX =
                (col + 0.5) * (roofHalfWidth / tileColumns);

            const x = side * distanceX;
            const surfaceY = getRoofY(x);

            for (let row = 0; row < tileRows; row++) {
                const z =
                    -roofHalfDepth +
                    (row + 0.5) * (roofHalfDepth * 2 / tileRows);

                const tile = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        tileWidth * 0.94,
                        tileThickness,
                        tileLength * 0.92
                    ),
                    tileMaterials[
                        Math.floor(Math.random() * tileMaterials.length)
                    ]
                );

                // چرخش کاشی برای قرار گرفتن روی شیب سقف
                const slopeAngle = Math.atan(
                    roofHeight / roofHalfWidth
                );

                tile.rotation.z = side === -1
                    ? slopeAngle
                    : -slopeAngle;

                tile.position.set(
                    x,
                    surfaceY + tileThickness * 0.55,
                    z
                );

                tile.castShadow = true;
                tile.receiveShadow = true;
                house.add(tile);
            }
        }
    }

    // لبه‌های برجسته سقف در دو طرف شیروانی
    const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x78402D,
        roughness: 1
    });

    for (const side of [-1, 1]) {
        const edge = new THREE.Mesh(
            new THREE.BoxGeometry(
                Math.max(5, width * 0.035),
                Math.max(5, width * 0.035),
                roofHalfDepth * 2 + 12
            ),
            edgeMaterial
        );

        edge.position.set(
            side * (roofHalfWidth + 2),
            height + 2,
            0
        );

        edge.castShadow = true;
        house.add(edge);
    }

    // کاشی‌های گرد روی خط رأس سقف
    const ridgeTileMaterial = new THREE.MeshStandardMaterial({
        color: 0x8E3F2B,
        roughness: 0.9
    });

    const ridgeTileLength = Math.max(18, depth * 0.18);
    const ridgeCount = Math.ceil(
        (roofHalfDepth * 2) / ridgeTileLength
    );

    for (let i = 0; i < ridgeCount; i++) {
        const ridgeTile = new THREE.Mesh(
            new THREE.CylinderGeometry(
                Math.max(5, width * 0.035),
                Math.max(5, width * 0.035),
                ridgeTileLength * 0.95,
                8
            ),
            ridgeTileMaterial
        );

        ridgeTile.rotation.x = Math.PI / 2;

        ridgeTile.position.set(
            0,
            ridgeY + 2,
            -roofHalfDepth +
                (i + 0.5) * (roofHalfDepth * 2 / ridgeCount)
        );

        ridgeTile.castShadow = true;
        ridgeTile.receiveShadow = true;
        house.add(ridgeTile);
    }

    // ساخت ایوان چوبی در صورت فعال بودن گزینه
    if (hasPorch) {
        const porchWidth = width * 0.95;
        const porchDepth = depth * 0.38;
        const porchHeight = height * 0.38;
        const porchZ = depth / 2 + porchDepth / 2;

        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x795033,
            roughness: 1
        });

        // کف ایوان
        const porchFloor = new THREE.Mesh(
            new THREE.BoxGeometry(porchWidth, 8, porchDepth),
            woodMaterial
        );
        porchFloor.position.set(0, porchHeight, porchZ);
        porchFloor.castShadow = true;
        porchFloor.receiveShadow = true;
        house.add(porchFloor);

        // ستون‌های جلویی ایوان
        const postWidth = Math.max(5, width * 0.035);
        const postHeight = porchHeight + 5;

        for (const side of [-1, 1]) {
            const post = new THREE.Mesh(
                new THREE.BoxGeometry(postWidth, postHeight, postWidth),
                woodMaterial
            );

            post.position.set(
                side * porchWidth * 0.43,
                postHeight / 2,
                depth / 2 + porchDepth
            );

            post.castShadow = true;
            post.receiveShadow = true;
            house.add(post);
        }

        // تیر افقی بالای ستون‌ها
        const porchBeam = new THREE.Mesh(
            new THREE.BoxGeometry(porchWidth, postWidth, postWidth),
            woodMaterial
        );

        porchBeam.position.set(
            0,
            postHeight,
            depth / 2 + porchDepth
        );

        porchBeam.castShadow = true;
        house.add(porchBeam);

        // سقف ایوان
        const porchRoof = new THREE.Mesh(
            new THREE.BoxGeometry(
                porchWidth + 12,
                7,
                porchDepth + 12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x68412F,
                roughness: 1
            })
        );

        porchRoof.position.set(
            0,
            postHeight + 4,
            porchZ
        );

        porchRoof.castShadow = true;
        porchRoof.receiveShadow = true;
        house.add(porchRoof);
    }

    // دودکش آجری روی یکی از شیب‌های سقف
    const chimneyWidth = width * 0.14;
    const chimneyHeight = height * 0.42;

    const chimneyGeometry = new THREE.BoxGeometry(
        chimneyWidth,
        chimneyHeight,
        chimneyWidth
    );

    const chimneyMaterial = new THREE.MeshStandardMaterial({
        color: 0xA6533B,
        roughness: 1
    });

    const chimney = new THREE.Mesh(
        chimneyGeometry,
        chimneyMaterial
    );

    chimney.position.set(
        width * 0.25,
        height + roofHeight * 0.35,
        -depth * 0.12
    );

    chimney.rotation.z = -0.35;
    chimney.castShadow = true;
    chimney.receiveShadow = true;

    house.add(chimney);

    // کلاهک بالای دودکش
    const chimneyCap = new THREE.Mesh(
        new THREE.BoxGeometry(
            chimneyWidth * 1.3,
            4,
            chimneyWidth * 1.3
        ),
        chimneyMaterial
    );

    chimneyCap.position.set(
        chimney.position.x,
        chimney.position.y + chimneyHeight / 2,
        chimney.position.z
    );

    house.add(chimneyCap);

    // ابعاد در متناسب با ارتفاع یک طبقه
    const doorGeometry = new THREE.BoxGeometry(
        width * 0.22,
        floorHeight * 0.48,
        3
    );

    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x59351F,
        roughness: 1
    });

    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(
        0,
        floorHeight * 0.24,
        depth / 2 + 1.6
    );
    house.add(door);


    // قاب چوبی سنتی دور در ورودی
    const doorFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0x70472D,
        roughness: 1
    });

    const doorFrameWidth = Math.max(5, width * 0.035);
    const doorWidth = width * 0.22;
    const doorHeight = floorHeight * 0.48;
    const doorZ = depth / 2 + 3.5;

    // دو تیر عمودی قاب در
    for (const side of [-1, 1]) {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(
                doorFrameWidth,
                doorHeight + doorFrameWidth,
                doorFrameWidth
            ),
            doorFrameMaterial
        );

        frame.position.set(
            side * (doorWidth / 2 + doorFrameWidth / 2),
            doorHeight / 2,
            doorZ
        );

        frame.castShadow = true;
        house.add(frame);
    }

    // تیر افقی بالای در
    const doorHeader = new THREE.Mesh(
        new THREE.BoxGeometry(
            doorWidth + doorFrameWidth * 2,
            doorFrameWidth,
            doorFrameWidth
        ),
        doorFrameMaterial
    );

    doorHeader.position.set(
        0,
        doorHeight + doorFrameWidth / 2,
        doorZ
    );

    doorHeader.castShadow = true;
    house.add(doorHeader);

    // دستگیره فلزی در ورودی
    const handleGeometry = new THREE.SphereGeometry(2.5, 8, 8);

    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xD6B46A,
        metalness: 0.75,
        roughness: 0.3
    });

    const doorHandle = new THREE.Mesh(
        handleGeometry,
        handleMaterial
    );

    doorHandle.position.set(
        width * 0.055,
        height * 0.25,
        depth / 2 + 4
    );

    house.add(doorHandle);

    // قاب چوبی و شیشه‌های دو پنجره جلوی خانه
    // اندازه پنجره متناسب با عرض و ارتفاع هر طبقه
    const windowWidth = width * 0.19;
    const windowHeight = floorHeight * 0.38;
    const frameThickness = Math.max(3, width * 0.025);
    const windowZ = depth / 2 + 2;

    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x91B9C5,
        roughness: 0.4,
        metalness: 0.05
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x59351F,
        roughness: 1
    });


for (let floor = 0; floor < floors; floor++) {
    // ارتفاع مرکز پنجره در هر طبقه
    const windowY = floor * floorHeight + floorHeight * 0.50;

    // دو پنجره در نمای جلویی خانه
    for (const side of [-1, 1]) {
        const windowGroup = new THREE.Group();

        // شیشه پنجره
        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(
                windowWidth,
                windowHeight,
                2
            ),
            windowMaterial
        );

        windowGroup.add(glass);

        // قاب عمودی چپ و راست
        for (const frameSide of [-1, 1]) {
            const verticalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(
                    frameThickness,
                    windowHeight + frameThickness,
                    4
                ),
                frameMaterial
            );

            verticalFrame.position.x =
                frameSide * (windowWidth / 2);

            windowGroup.add(verticalFrame);
        }

        // قاب افقی بالا و پایین
        for (const frameSide of [-1, 1]) {
            const horizontalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(
                    windowWidth + frameThickness,
                    frameThickness,
                    4
                ),
                frameMaterial
            );

            horizontalFrame.position.y =
                frameSide * (windowHeight / 2);

            windowGroup.add(horizontalFrame);
        }

        // قرارگیری پنجره در طبقه و سمت مربوطه
        windowGroup.position.set(
            side * width * 0.32,
            windowY,
            windowZ
        );

        house.add(windowGroup);
    }
}



    // متریال تیرهای چوبی با رنگ طبیعی چوب قدیمی
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x68452D,
        roughness: 0.95,
        metalness: 0
    });

    const beamThickness = Math.max(4, width * 0.035);

    // تیر افقی بالای در و پنجره‌ها
    const upperBeam = new THREE.Mesh(
        new THREE.BoxGeometry(
            width * 0.88,
            beamThickness,
            beamThickness
        ),
        beamMaterial
    );

    upperBeam.position.set(
        0,
        height * 0.88,
        depth / 2 + beamThickness / 2
    );

    house.add(upperBeam);

    // تیرهای عمودی کناره‌های نمای خانه
    for (const side of [-1, 1]) {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(
                beamThickness,
                height * 0.85,
                beamThickness
            ),
            beamMaterial
        );

        beam.position.set(
            side * width * 0.43,
            height * 0.43,
            depth / 2 + beamThickness / 2
        );

        house.add(beam);
    }

    // گلدان‌های کوچک کنار ورودی
    const potMaterial = new THREE.MeshStandardMaterial({
        color: 0xA6533B,
        roughness: 1
    });

    const flowerMaterial = new THREE.MeshStandardMaterial({
        color: 0xE8B8C8,
        roughness: 0.8
    });

    for (const side of [-1, 1]) {
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 3.5, 10, 8),
            potMaterial
        );

        pot.position.set(
            side * width * 0.19,
            5,
            depth / 2 + 12
        );

        house.add(pot);

        const flower = new THREE.Mesh(
            new THREE.SphereGeometry(5, 8, 6),
            flowerMaterial
        );

        flower.position.set(
            pot.position.x,
            13,
            pot.position.z
        );

        house.add(flower);
    }

    // سنگ‌فرش کوتاه جلوی در
    const pathMaterial = new THREE.MeshStandardMaterial({
        color: 0xA9A092,
        roughness: 1
    });

    for (let i = 0; i < 4; i++) {
        const stone = new THREE.Mesh(
            new THREE.BoxGeometry(
                width * 0.18,
                3,
                15
            ),
            pathMaterial
        );

        stone.position.set(
            0,
            1.5,
            depth / 2 + 25 + i * 18
        );

        house.add(stone);
    }

    // تنظیم موقعیت و چرخش خانه
    house.position.set(x, 0, z);
    house.rotation.y = rotation;

    scene.add(house);
    return house;
}



/**
 * ساخت جاده صاف روی زمین
 * عرض و طول جاده بر اساس مختصات افقی X و Z هستند.
 */
function createRoad({
    x,
    z,
    width,
    length,
    color = 0xB9A487,
    rotation = 0
}) {
    const geometry = new THREE.PlaneGeometry(
        width,
        length
    );


    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0
    });

    const road = new THREE.Mesh(
        geometry,
        material
    );

    // قرار دادن جاده روی سطح افقی
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotation;

    // ارتفاع کم برای جلوگیری از هم‌پوشانی با زمین
    road.position.set(x, 4, z);

    road.receiveShadow = true;

    scene.add(road);

    return road;
}

// ساخت خودکار خانه‌های یک محله
function createVillageHouseGrid({
    centerX,
    startZ,
    columns,
    rows,
    spacingX = 350,
    spacingZ = 300,
    wallColor = 0xD8C09A,
    roofColor = 0x78452D,
    rotation = 0,
    hasPorch = false,
}) {
    const houses = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            // جابه‌جایی ردیف‌ها برای طبیعی‌تر شدن چیدمان
            const offsetX = row % 2 === 0 ? 0 : spacingX / 2;

            // انتخاب تصادفی رنگ بدنه خانه
            const wallColors = [
                0xE0CCAC, // کرم روشن
                0xD9B66F, // زرد گرم
                0xBDB5A4, // خاکستری سنگی
                0xCDB697, // بژ
                0xD8B4A0, // صورتی خاکی
                0xB7C9A8  // سبز ملایم
            ];

            // انتخاب تصادفی رنگ سقف
            const roofColors = [
                0x9B4934, // سفالی
                0x68412F, // قهوه‌ای
                0x78372C, // قرمز تیره
                0x805038, // قهوه‌ای گرم
                0x59634A  // سبز زیتونی
            ];

            const randomWallColor =
                wallColors[Math.floor(Math.random() * wallColors.length)];

            const randomRoofColor =
                roofColors[Math.floor(Math.random() * roofColors.length)];


            // انتخاب تصادفی تعداد طبقات خانه
            const floorRoll = Math.random();

            const floors = floorRoll < 0.45
                ? 1
                : floorRoll < 0.80
                    ? 2
                    : 3;

            // اندازه کلی خانه
            const houseScale = 0.85 + Math.random() * 0.35;

            const houseWidth = 220 * houseScale;
            const houseHeight = 150 * houseScale * floors;
            const houseDepth = 120 * houseScale;

            houses.push(
                createHouse({
                    x: centerX +
                        (col - (columns - 1) / 2) * spacingX +
                        offsetX,
                    z: startZ + row * spacingZ,
                    width: houseWidth,
                    height: houseHeight,
                    floors: floors,
                    depth: houseDepth,
                    wallColor: randomWallColor,
                    roofColor: randomRoofColor,
                    hasPorch: hasPorch,
                    rotation: rotation + (Math.random() - 0.5) * 0.1
                })
            );
        }
    }

    return houses;
}


/**
 * شبکه اولیه جاده‌های روستا
 */

// جاده اصلی شرقی ـ غربی، پایین محله‌ها
createRoad({
    x: -550,
    z: 7100,
    width: 9200,
    length: 190,
    color: 0x1E1E1E
});

// مسیر اتصال سمت چپ به جاده اصلی
createRoad({
    x: -2000,
    z: 6100,
    width: 140,
    length: 2200,
    color: 0x1E1E1E
});

// مسیر اتصال سمت راست به جاده اصلی
createRoad({
    x: 1000,
    z: 6100,
    width: 140,
    length: 2200,
    color: 0x1E1E1E
});


/**
 * ساخت خط‌چین سفید وسط جاده
 * جهت خط می‌تواند افقی یا عمودی باشد.
 */
function createRoadLine({ x, z, length, direction = "horizontal" }) {
    const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1,
        metalness: 0
    });

    const dashLength = 90;
    const gapLength = 90;

    for (let offset = -length / 2 + dashLength / 2;
         offset < length / 2;
         offset += dashLength + gapLength) {

        const dashWidth = Math.min(
            dashLength,
            length / 2 - offset + dashLength / 2
        );

        if (dashWidth <= 0) continue;

        const geometry = direction === "horizontal"
            ? new THREE.PlaneGeometry(dashWidth, 12)
            : new THREE.PlaneGeometry(12, dashWidth);

        const dash = new THREE.Mesh(geometry, lineMaterial);

        dash.rotation.x = -Math.PI / 2;
        dash.position.set(
            direction === "horizontal" ? x + offset : x,
            4.5,
            direction === "horizontal" ? z : z + offset
        );

        scene.add(dash);
    }
}


/* خط‌چین وسط جاده اصلی */
createRoadLine({
    x: -500,
    z: 7080,
    length: 9200,
    direction: "horizontal"
});

/* خط‌چین مسیر سمت چپ */
createRoadLine({
    x: -2000,
    z: 6100,
    length: 2000,
    direction: "vertical"
});

/* خط‌چین مسیر سمت راست */
createRoadLine({
    x: 1000,
    z: 6100,
    length: 2000,
    direction: "vertical"
});


// محله روبه‌روی کوه: ۲۰ خانه
const mountainVillageHouses = createVillageHouseGrid({
    centerX: -600,
    startZ: 4900,
    columns: 5,
    rows: 3,
    spacingX: 550,
    spacingZ: 500
});

// محله سمت چپ: ۳۰ خانه
const leftVillageHouses = createVillageHouseGrid({
    centerX: -3600,
    startZ: 5100,
    columns: 6,
    rows: 5,
    spacingX: 450,
    spacingZ: 400,
    wallColor: 0xCDB697,
    roofColor: 0x70442D,
    rotation: Math.PI / 2
});

// محله سمت راست: ۳۰ خانه
const rightVillageHouses = createVillageHouseGrid({
    centerX: 2400,
    startZ: 5100,
    columns: 6,
    rows: 5,
    spacingX: 450,
    spacingZ: 400,
    wallColor: 0xD5BE9A,
    roofColor: 0x69412B,
    rotation: Math.PI / -2
});



/**
 * چمن‌کاری سه محله روستا
 * در این مرحله خانه‌ها را مستقیماً از آرایه‌های محله می‌گیریم.
 */

// محله کوهستانی
createGrassBlades({
    x: -540,
    z: 5300,
    width: 3000,
    depth: 1500,
    houses: mountainVillageHouses,
    count: 600
});

// محله سمت چپ
createGrassBlades({
    x: -3700,
    z: 5800,
    width: 3300,
    depth: 2400,
    houses: leftVillageHouses,
    count: 600
});

// محله سمت راست
createGrassBlades({
    x: 2650,
    z: 5800,
    width: 3200,
    depth: 2450,
    houses: rightVillageHouses,
    count: 600
});


/**
 * ساخت مدل درخت سه‌بعدی سبک برای روستای لیان
 * تنه و تاج درخت‌ها از هندسه‌های مشترک استفاده می‌کنند.
 */
function createTreeModel({
    x = 0,
    z = 0,
    scale = 1,
    color = 0x43883B
} = {}) {
    const tree = new THREE.Group();

    // تنه قهوه‌ای درخت
    const trunkGeometry = new THREE.CylinderGeometry(
        3 * scale,
        5 * scale,
        36 * scale,
        6
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x79502D,
        roughness: 1
    });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = 18 * scale;
    tree.add(trunk);

    // سه لایه تاج برای ایجاد ظاهر طبیعی‌تر
    const crownGeometry = new THREE.IcosahedronGeometry(
        19 * scale,
        1
    );

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        flatShading: true
    });

    const crownPositions = [
        { x: 0, y: 43, z: 0, size: 1.00 },
        { x: -10, y: 53, z: 2, size: 0.78 },
        { x: 9, y: 52, z: -3, size: 0.82 }
    ];

    for (const part of crownPositions) {
        const crown = new THREE.Mesh(
            crownGeometry,
            crownMaterial
        );

        crown.position.set(
            part.x * scale,
            part.y * scale,
            part.z * scale
        );

        crown.scale.setScalar(part.size);
        tree.add(crown);
    }

    // قرار دادن درخت در مختصات موردنظر
    tree.position.set(x, 0, z);

    // سایه‌گذاری فقط برای تنه؛ تاج‌ها سبک می‌مانند.
    trunk.castShadow = true;
    trunk.receiveShadow = false;

    tree.traverse((object) => {
        if (object.isMesh && object !== trunk) {
            object.castShadow = false;
            object.receiveShadow = false;
        }
    });

    scene.add(tree);

    return tree;
}



/**
 * درخت‌کاری گروهی محله‌های روستای لیان
 * استفاده از InstancedMesh برای کاهش هزینه ترسیم درخت‌ها
 */
function createVillageTrees({
    houses = [],
    areas = []
} = {}) {
    // تعداد درخت‌ها از روی تنظیم هر محله تعیین می‌شود.
    const totalCount = areas.reduce(
        (sum, area) => sum + area.count,
        0
    );

    if (totalCount === 0) return;

    // تنه‌های بلندتر و ضخیم‌تر
    const trunkGeometry = new THREE.CylinderGeometry(5, 8, 65, 7);

    // تاج‌های بزرگ‌تر برای درختان
    const roundCrownGeometry = new THREE.SphereGeometry(27, 10, 8);
    const naturalCrownGeometry = new THREE.IcosahedronGeometry(30, 1);

    // متریال‌ها برای استفاده مشترک
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1
    });

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        flatShading: true
    });

    // یک دسته برای تنه‌ها و دو دسته برای انواع تاج
    const trunks = new THREE.InstancedMesh(
        trunkGeometry, trunkMaterial, totalCount
    );

    const roundCrowns = new THREE.InstancedMesh(
        roundCrownGeometry, crownMaterial, totalCount * 3
    );

    const naturalCrowns = new THREE.InstancedMesh(
        naturalCrownGeometry, crownMaterial, totalCount * 3
    );

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let treeIndex = 0;
    let roundIndex = 0;
    let naturalIndex = 0;

    // جلوگیری از کاشت درخت روی خانه‌ها و مسیرها
    function isBlocked(x, z) {
        const nearHouse = houses.some((house) =>
            Math.abs(x - house.position.x) < 165 &&
            Math.abs(z - house.position.z) < 165
        );

        if (nearHouse) return true;

        // جاده اصلی
        if (Math.abs(z - 7100) < 125 &&
            x > -5200 && x < 4100) {
            return true;
        }

        // جاده‌های اتصال محله‌ها
        const nearLeftRoad =
            Math.abs(x + 2000) < 105 &&
            z > 4900 && z < 7250;

        const nearRightRoad =
            Math.abs(x - 1000) < 105 &&
            z > 4900 && z < 7250;

        if (nearLeftRoad || nearRightRoad) return true;

        // فضای میدان مرکزی
        const nearSquare =
            Math.abs(x + 600) < 1400 &&
            Math.abs(z - 6500) < 550;

        return nearSquare;
    }

    for (const area of areas) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = area.count * 15;

        while (
            placed < area.count &&
            attempts < maxAttempts
        ) {
            attempts++;

            const x = area.x +
                (Math.random() - 0.5) * area.width;

            const z = area.z +
                (Math.random() - 0.5) * area.depth;

            if (isBlocked(x, z)) continue;

            // تفاوت طبیعی اندازه درخت‌ها
            const scale = 0.95 + Math.random() * 0.95;

            // تنه
            dummy.position.set(x, 10 * scale, z);
            dummy.rotation.set(0, Math.random() * 0.4, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();

            trunks.setMatrixAt(treeIndex, dummy.matrix);

            color.setHSL(
                0.075 + Math.random() * 0.025,
                0.35 + Math.random() * 0.15,
                0.28 + Math.random() * 0.12
            );

            trunks.setColorAt(treeIndex, color);

            // انتخاب ترکیبی تاج گرد یا نامنظم
            const isNatural = Math.random() < 0.5;
            const crownMesh = isNatural
                ? naturalCrowns
                : roundCrowns;

            let crownIndex = isNatural
                ? naturalIndex
                : roundIndex;

            const layerCount = isNatural ? 3 : 3;

            for (let layer = 0; layer < layerCount; layer++) {
                const offsetX = layer === 0
                    ? 0
                    : (Math.random() - 0.5) * 15;

                const offsetZ = layer === 0
                    ? 0
                    : (Math.random() - 0.5) * 15;

                const layerScale = layer === 0
                    ? 1
                    : 0.65 + Math.random() * 0.2;

                dummy.position.set(
                    x + offsetX * scale,
                    (82 + layer * 8) * scale,
                    z + offsetZ * scale
                );

                dummy.rotation.set(
                    0,
                    Math.random() * Math.PI,
                    0
                );

                dummy.scale.set(
                    scale * layerScale,
                    scale * layerScale,
                    scale * layerScale
                );

                dummy.updateMatrix();

                crownMesh.setMatrixAt(
                    crownIndex,
                    dummy.matrix
                );

                // تغییر ملایم رنگ تاج‌ها
                color.setHSL(
                    0.27 + Math.random() * 0.07,
                    0.40 + Math.random() * 0.22,
                    0.28 + Math.random() * 0.17
                );

                crownMesh.setColorAt(crownIndex, color);

                if (isNatural) {
                    naturalIndex++;
                } else {
                    roundIndex++;
                }

                crownIndex++;
            }

            treeIndex++;
            placed++;
        }
    }

    // فقط نمونه‌هایی که واقعاً ساخته شده‌اند رندر شوند.
    trunks.count = treeIndex;
    roundCrowns.count = roundIndex;
    naturalCrowns.count = naturalIndex;

    trunks.instanceMatrix.needsUpdate = true;
    roundCrowns.instanceMatrix.needsUpdate = true;
    naturalCrowns.instanceMatrix.needsUpdate = true;

    if (trunks.instanceColor) {
        trunks.instanceColor.needsUpdate = true;
    }

    if (roundCrowns.instanceColor) {
        roundCrowns.instanceColor.needsUpdate = true;
    }

    if (naturalCrowns.instanceColor) {
        naturalCrowns.instanceColor.needsUpdate = true;
    }

    trunks.castShadow = true;
    trunks.receiveShadow = false;

    // سایه تاج‌ها غیرفعال است تا هزینه رندر کمتر شود.
    roundCrowns.castShadow = false;
    roundCrowns.receiveShadow = false;
    naturalCrowns.castShadow = false;
    naturalCrowns.receiveShadow = false;

    scene.add(trunks);
    scene.add(roundCrowns);
    scene.add(naturalCrowns);

    return {
        trunks,
        roundCrowns,
        naturalCrowns,
        treeCount: treeIndex
    };
}


/**
 * درخت‌کاری با تراکم متوسط در سه محله
 */

// ترکیب خانه‌های سه محله برای جلوگیری از کاشت درخت
// در محدوده خانه‌ها
const allVillageHouses = [
    ...mountainVillageHouses,
    ...leftVillageHouses,
    ...rightVillageHouses
];

const villageTrees = createVillageTrees({
    houses: allVillageHouses,

    areas: [
        {
            // محله کوهستانی
            x: -740,
            z: 5300,
            width: 3000,
            depth: 1500,
            count: 30
        },
        {
            // محله سمت چپ
            x: -3700,
            z: 5800,
            width: 3300,
            depth: 2400,
            count: 45
        },
        {
            // محله سمت راست
            x: 2650,
            z: 5800,
            width: 3200,
            depth: 2450,
            count: 45
        }
    ]
});


// ============================================================
// 11) تابع ساخت یک رشته‌کوه سه‌بعدی
// ============================================================
//
// نکته بسیار مهم:
//
// مختصات کوه دیگر x و z جهانی نیستند.
//
// هندسه داخل مختصات محلی خودش ساخته می‌شود:
//
//       مرکز کوه
//          ↓
//      ┌─────────┐
//      │   کوه   │
//      └─────────┘
//
// سپس خود Group در موقعیت موردنظر جهان قرار می‌گیرد.
//
// نتیجه:
// هر کوه می‌تواند حول محور Y خودش بچرخد.
// ============================================================

function createMountainRange({

    x = 0,

    z = -1000,

    width = 3000,

    height = 700,

    depth = 900,

    color = 0x888888,

    arcDepth = 0,

    rotationY = 0

}) {

    // --------------------------------------------------------
    // گروه مستقل این کوه
    // --------------------------------------------------------

    const group =
        new THREE.Group();


    // --------------------------------------------------------
    // تعداد قطعات افقی
    // --------------------------------------------------------

    const segments =
        40;


    // --------------------------------------------------------
    // تعداد قطعات عمقی
    // --------------------------------------------------------

    const depthSegments =
        8;


    // --------------------------------------------------------
    // نقاط اصلی خط کوه
    // --------------------------------------------------------

    const points = [];


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const t =
            i / segments;


        const px =
            (t - 0.5) *
            width;


        const normalized =
            Math.abs(
                t - 0.5
            ) * 2;


        // ----------------------------------------------------
        // فرم اصلی کوه
        // ----------------------------------------------------

        const baseArc =
            Math.pow(
                Math.max(
                    0,
                    1 -
                    normalized *
                    normalized
                ),
                0.75
            );


        // ----------------------------------------------------
        // موج‌های طبیعی سطح کوه
        // ----------------------------------------------------

        const wave1 =
            Math.sin(
                t *
                Math.PI *
                1
            ) * 0.15;


        const wave2 =
            Math.sin(
                t *
                Math.PI *
                7
            ) * 0.08;


        const wave3 =
            Math.sin(
                t *
                Math.PI *
                20
            ) * 0.04;


        const mountainShape =
            Math.max(
                0.15,
                baseArc +
                wave1 +
                wave2 +
                wave3
            );


        const py =
            100 +
            mountainShape *
            height;


        points.push({
            x: px,
            y: py
        });
    }


    // ========================================================
    // ساخت Vertexها
    // ========================================================

    const vertices = [];


    const indices = [];


    for (
        let depthIndex = 0;
        depthIndex <= depthSegments;
        depthIndex++
    ) {

        const depthT =
            depthIndex /
            depthSegments;


        const depthNormalized =
            (depthT - 0.5) *
            2;


        // ----------------------------------------------------
        // فرم حجم کوه در عمق
        // ----------------------------------------------------

        const depthProfile =
            Math.pow(
                Math.max(
                    0,
                    1 -
                    depthNormalized *
                    depthNormalized
                ),
                0.65
            );


        const depthOffset =
            depthNormalized *
            depth;


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const p =
                points[i];


            const py =
                60 +
                (p.y - 10) *
                depthProfile;


            const terrainWave =
                Math.sin(
                    i * 10 +
                    depthIndex * 1.8
                ) *
                5 *
                depthProfile;


            const finalY =
                Math.max(
                    2,
                    py +
                    terrainWave
                );


            // ------------------------------------------------
            // خم طبیعی خود کوه
            //
            // این مقدار فقط شکل خود کوه را خم می‌کند.
            // چرخش کلی کوه در rotationY انجام می‌شود.
            // ------------------------------------------------

            const normalizedX =
                (i / segments - 0.5);


            const arcAmount =
                normalizedX *
                normalizedX;


            const curvedZ =
                arcAmount *
                arcDepth;


            // ------------------------------------------------
            // نکته مهم:
            //
            // x و z دیگر مختصات جهانی نیستند.
            //
            // این مختصات محلی خود کوه هستند.
            // ------------------------------------------------

            vertices.push(
                p.x,
                finalY,
                curvedZ +
                depthOffset
            );
        }
    }


    // ========================================================
    // ساخت مثلث‌های سطح
    // ========================================================

    for (
        let depthIndex = 0;
        depthIndex < depthSegments;
        depthIndex++
    ) {

        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const rowA =
                depthIndex *
                (segments + 1);


            const rowB =
                (depthIndex + 1) *
                (segments + 1);


            const a =
                rowA + i;


            const b =
                rowA + i + 1;


            const c =
                rowB + i;


            const d =
                rowB + i + 1;


            indices.push(
                a,
                c,
                b
            );


            indices.push(
                b,
                c,
                d
            );
        }
    }


    // ========================================================
    // ساخت Geometry
    // ========================================================

    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );


    geometry.setIndex(
        indices
    );


    geometry.computeVertexNormals();


    // ========================================================
    // متریال کوه
    // ========================================================

    const material =
        new THREE.MeshStandardMaterial({

            color: color,

            roughness: 1,

            metalness: 0,

            side:
                THREE.DoubleSide
        });


    // ========================================================
    // Mesh
    // ========================================================

    const mountain =
        new THREE.Mesh(
            geometry,
            material
        );


    mountain.castShadow =
        true;


    mountain.receiveShadow =
        true;


    group.add(
        mountain
    );


    // ========================================================
    // قرار دادن گروه در جهان
    //
    // حالا x و z موقعیت خود کوه هستند.
    // ========================================================

    group.position.set(
        x,
        0,
        z
    );


    // ========================================================
    // چرخش مستقل کوه حول محور عمودی خودش
    //
    // محور Y = محور عمودی
    // ========================================================

    group.rotation.y =
        rotationY;


    // ========================================================
    // اضافه کردن کوه به صحنه
    // ========================================================

    scene.add(
        group
    );


    return group;
}


// ============================================================
// 12) لایه اول — خیلی دور
// ============================================================

createMountainRange({
    x: -1400,
    z: -2400,
    width: 3900,
    height: 900,
    depth: 1000,
    arcDepth: 350,
    rotationY: -0.15,
    color: 0xDC143C
});

createMountainRange({
    x: -5000,
    z: -2400,
    width: 3600,
    height: 900,
    depth: 1000,
    arcDepth: 300,
    rotationY: 0.15,
    color: 0x310000
});

createMountainRange({
    x: 2200,
    z: -2300,
    width: 4000,
    height: 900,
    depth: 1000,
    arcDepth: 250,
    rotationY: -0.1,
    color: 0x800020
});

createMountainRange({
    x: 6500,
    z: -1500,
    width: 5000,
    height: 900,
    depth: 1000,
    arcDepth: 400,
    rotationY: -0.4,
    color: 0x800020
});


// ============================================================
// 13) لایه دوم — دور
// ============================================================

createMountainRange({
    x: -1200,
    z: -700,
    width: 4000,
    height: 800,
    depth: 1000,
    arcDepth: 350,
    rotationY: -0.1,
    color: 0x32174D
});

createMountainRange({
    x: -5400,
    z: -300,
    width: 4000,
    height: 800,
    depth: 1000,
    arcDepth: 500,
    rotationY: 0.2,
    color: 0x32127A
});

createMountainRange({
    x: 3200,
    z: -700,
    width: 4000,
    height: 850,
    depth: 800,
    arcDepth: 350,
    rotationY: -0.25,
    color: 0x93ABC5
});

createMountainRange({
    x: 6500,
    z: 400,
    width: 3400,
    height: 800,
    depth: 1000,
    arcDepth: 400,
    rotationY: -0.40,
    color: 0x807A3B
});


// ============================================================
// 14) لایه سوم — میانی
// ============================================================

createMountainRange({
    x: -1500,
    z: 1000,
    width: 4000,
    height: 950,
    depth: 900,
    arcDepth: 500,
    rotationY: 0.10,
    color: 0xDF00FF
});

createMountainRange({
    x: 1300,
    z: 1000,
    width: 2000,
    height: 1000,
    depth: 900,
    arcDepth: 500,
    rotationY: 0.10,
    color: 0xDF00FF
});

createMountainRange({
    x: -5000,
    z: 1500,
    width: 3500,
    height: 950,
    depth: 1000,
    arcDepth: 850,
    rotationY: 0.25,
    color: 0xC71585
});

createMountainRange({
    x: 2900,
    z: 1000,
    width: 3000,
    height: 1000,
    depth: 1000,
    arcDepth: 500,
    rotationY: -0.15,
    color: 0xFF00FF
});

createMountainRange({
    x: 6000,
    z: 2000,
    width: 3800,
    height: 950,
    depth: 1000,
    arcDepth: 550,
    rotationY: -0.35,
    color: 0xFF00FF
});


// ============================================================
// 15) لایه چهارم — نزدیک‌تر
// ============================================================

createMountainRange({
    x: -3000,
    z: 3000,
    width: 2600,
    height: 1000,
    depth: 1000,
    arcDepth: 500,
    rotationY: 0.15,
    color: 0xC4B49E
});

createMountainRange({
    x: -5000,
    z: 3500,
    width: 2600,
    height: 1000,
    depth: 1000,
    arcDepth: 750,
    rotationY: 0.35,
    color: 0xCCCCFF
});

createMountainRange({
    x: 3000,
    z: 2900,
    width: 3000,
    height: 1000,
    depth: 1000,
    arcDepth: 700,
    rotationY: -0.15,
    color: 0xA99A87
});

createMountainRange({
    x: 5900,
    z: 3400,
    width: 3100,
    height: 1000,
    depth: 1200,
    arcDepth: 500,
    rotationY: -0.35,
    color: 0x4F7942
});


// ============================================================
// 16) کوه اصلی
// ============================================================

createMountainRange({
    x: 0,
    z: 2500,
    width: 3500,
    height: 1500,
    depth: 1200,
    arcDepth: 500,
    rotationY: 0,
    color: 0xFFFFFF
});


// ============================================================
// 17) کوه‌های نزدیک سمت چپ
// ============================================================
//
// اینجا چرخش بیشتر است تا بعداً بتوانیم
// فرم نیم‌دایره را واضح‌تر بسازیم.
// ============================================================

createMountainRange({
    x: -1400,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 850,
    rotationY: -0.45,
    color: 0x7F8F9F
});

createMountainRange({
    x: -3000,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 1000,
    rotationY: -0.65,
    color: 0xFF1919
});


// ============================================================
// 18) کوه‌های نزدیک سمت راست
// ============================================================

createMountainRange({
    x: 1100,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 850,
    rotationY: 0.45,
    color: 0x8E9EAE
});

createMountainRange({
    x: 2100,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 1000,
    rotationY: 0.65,
    color: 0x006400
});


// ============================================================
// 19) کنترل دوربین
// ============================================================

const CAMERA_X =
      -100;


const CAMERA_Y =
    3000;


const CAMERA_Z =
    8000;


const CAMERA_ROTATION_X =
     -0.8;



// ============================================================
// 20) انیمیشن
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    camera.position.x =
        CAMERA_X;


    camera.position.y =
        CAMERA_Y;


    camera.position.z =
        CAMERA_Z;


    camera.rotation.x =
        CAMERA_ROTATION_X;


    camera.rotation.y =
        0;


    camera.rotation.z =
        0;


    renderer.render(
        scene,
        camera
    );
}


// ============================================================
// 21) واکنش به تغییر اندازه صفحه
// ============================================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


// ============================================================
// 22) شروع صحنه
// ============================================================

animate();