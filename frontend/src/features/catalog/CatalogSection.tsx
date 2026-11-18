import React, { useMemo, useState } from 'react';
import { Award, Coffee, Eye, Filter, Flame, Heart, Mountain, ShoppingBag } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { GrindOption, ProcessMethod, Product, RoastLevel } from '../../types/domain.types';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';

export const GRIND_DROPDOWN_OPTIONS: DropdownOption<GrindOption>[] = [
  {
    value: GrindOption.WHOLE_BEAN,
    label: 'Nguyên hạt (Whole Bean)',
    description: 'Giữ trọn hương thơm tự nhiên lâu nhất',
  },
  {
    value: GrindOption.POUR_OVER_V60,
    label: 'Pha V60 / Pour Over',
    description: 'Cỡ xay vừa cho giấy lọc V60, Chemex',
  },
  {
    value: GrindOption.ESPRESSO,
    label: 'Pha máy Espresso',
    description: 'Cỡ xay mịn chuẩn áp suất máy pha',
  },
  {
    value: GrindOption.VIETNAMESE_PHIN,
    label: 'Pha Phin truyền thống',
    description: 'Cỡ xay vừa đậm đà cho Phin Việt Nam',
  },
  {
    value: GrindOption.FRENCH_PRESS,
    label: 'French Press / Cold Brew',
    description: 'Cỡ xay thô để ủ lạnh hoặc bình nén',
  },
];

const SORT_DROPDOWN_OPTIONS: DropdownOption<'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'SCA_DESC'>[] = [
  { value: 'DEFAULT', label: 'Sắp xếp: Nổi bật' },
  { value: 'SCA_DESC', label: 'Điểm SCA: Cao đến thấp' },
  { value: 'PRICE_ASC', label: 'Giá: Thấp đến cao' },
  { value: 'PRICE_DESC', label: 'Giá: Cao đến thấp' },
];

const ROAST_FILTER_OPTIONS: DropdownOption<'ALL' | RoastLevel>[] = [
  { value: 'ALL', label: 'Mức rang: Tất cả' },
  { value: RoastLevel.LIGHT, label: 'Light Roast (Pour Over)' },
  { value: RoastLevel.MEDIUM_LIGHT, label: 'Medium-Light Roast' },
  { value: RoastLevel.MEDIUM, label: 'Medium Roast (Cân bằng)' },
];

const PROCESS_FILTER_OPTIONS: DropdownOption<'ALL' | ProcessMethod>[] = [
  { value: 'ALL', label: 'Sơ chế: Tất cả' },
  { value: ProcessMethod.WASHED, label: 'Washed (Ướt truyền thống)' },
  { value: ProcessMethod.ANAEROBIC_FERMENTATION, label: 'Anaerobic (Yếm khí 96h)' },
  { value: ProcessMethod.CARBONIC_MACERATION, label: 'Carbonic Maceration' },
  { value: ProcessMethod.HONEY, label: 'Honey Process (Mật ong)' },
];

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    selectedGrind,
    setGrindForProduct,
    addCatalogProductToCart,
    openProductDetail,
    wishlistIds,
    toggleWishlist,
  } = useRoastRush();

  const sku = product.skus[0];
  const meta = product.coffeeMetadata;
  const currentGrind = selectedGrind[product.id] || GrindOption.WHOLE_BEAN;
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="rounded-2xl bg-white border border-stone-200/90 hover:border-amber-800/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Top: Product Image Banner & Badges */}
      <div>
        <div
          onClick={() => openProductDetail(product)}
          className="relative h-56 w-full overflow-hidden rounded-t-2xl bg-stone-100 cursor-pointer"
        >
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Top Left Origin & Process Pill */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide uppercase">
            {meta.originCountry} • {meta.region}
          </div>

          {/* Top Right SCA Score & Wishlist Heart Button (Task 2.1) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-amber-900 text-xs font-extrabold flex items-center gap-1 shadow-sm border border-amber-200/60">
              <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>SCA {meta.cuppingScore}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-sm transition"
              title={isWishlisted ? 'Bỏ yêu thích' : 'Lưu vào Yêu thích'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition ${
                  isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-stone-600 hover:text-rose-600'
                }`}
              />
            </button>
          </div>

          {/* Bottom Gradient & Metadata Strip */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent px-4 pt-6 pb-2.5 flex items-center justify-between text-[11px] text-stone-100 font-medium">
            <span className="flex items-center gap-1 truncate">
              <Mountain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{meta.altitudeMasl}</span>
            </span>
            <span className="truncate">
              Giống: <strong className="text-amber-300">{meta.varietal}</strong>
            </span>
          </div>
        </div>

        {/* Middle: Title, Description & Tasting Notes */}
        <div className="p-5 pb-4 space-y-3">
          <h3
            onClick={() => openProductDetail(product)}
            className="text-lg font-extrabold text-stone-900 hover:text-amber-800 cursor-pointer transition line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {product.shortDescription}
          </p>

          {/* Tasting Notes Pills */}
          <div className="flex flex-wrap content-start items-center gap-1.5 pt-0.5 min-h-[3.25rem]">
            {meta.tastingNotes.slice(0, 4).map((note) => (
              <span
                key={note}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-50/90 text-amber-900 border border-amber-200/70 font-semibold whitespace-nowrap"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Grind Selector, Price Row & Full-Width Action Buttons Row */}
      <div className="px-5 pb-5 pt-3.5 border-t border-stone-100 space-y-3 bg-stone-50/40 rounded-b-2xl">
        {/* Row 1: Grind Selector */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs text-stone-600 font-semibold whitespace-nowrap shrink-0">
            Cỡ xay:
          </label>
          <CustomDropdown
            value={currentGrind}
            options={GRIND_DROPDOWN_OPTIONS}
            onChange={(val) => setGrindForProduct(product.id, val)}
            className="flex-1 max-w-[215px]"
            menuClassName="w-64"
          />
        </div>

        {/* Row 2: Price & Package Info */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-2xl font-black text-stone-900 leading-none">
            {formatVnd(sku.basePriceVnd)}
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Túi {sku.weightGrams}g • Rang mới mỗi tuần
          </span>
        </div>

        {/* Row 3: Two Balanced Action Buttons */}
        <div className="grid grid-cols-12 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => openProductDetail(product)}
            className="col-span-5 h-10 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-300 font-bold text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition shadow-sm"
            title="Xem chi tiết hồ sơ hạt"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span>Chi tiết</span>
          </button>

          <button
            type="button"
            onClick={() => addCatalogProductToCart(product)}
            className="col-span-7 h-10 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CatalogSection: React.FC = () => {
  const { products, searchQuery } = useRoastRush();
  const [selectedOrigin, setSelectedOrigin] = useState<string>('ALL');
  const [selectedRoast, setSelectedRoast] = useState<'ALL' | RoastLevel>('ALL');
  const [selectedProcess, setSelectedProcess] = useState<'ALL' | ProcessMethod>('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'SCA_DESC'>('DEFAULT');

  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products]);

  const origins = useMemo(
    () => ['ALL', ...Array.from(new Set(activeProducts.map((p) => p.coffeeMetadata.originCountry)))],
    [activeProducts]
  );

  const filteredProducts = useMemo(() => {
    const list = activeProducts.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.coffeeMetadata.originCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.coffeeMetadata.tastingNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchOrigin = selectedOrigin === 'ALL' || p.coffeeMetadata.originCountry === selectedOrigin;
      const matchRoast = selectedRoast === 'ALL' || p.coffeeMetadata.roastLevel === selectedRoast;
      const matchProcess = selectedProcess === 'ALL' || p.coffeeMetadata.processMethod === selectedProcess;
      return matchQuery && matchOrigin && matchRoast && matchProcess;
    });

    if (sortBy === 'PRICE_ASC') {
      return [...list].sort((a, b) => a.skus[0].basePriceVnd - b.skus[0].basePriceVnd);
    }
    if (sortBy === 'PRICE_DESC') {
      return [...list].sort((a, b) => b.skus[0].basePriceVnd - a.skus[0].basePriceVnd);
    }
    if (sortBy === 'SCA_DESC') {
      return [...list].sort((a, b) => b.coffeeMetadata.cuppingScore - a.coffeeMetadata.cuppingScore);
    }
    return list;
  }, [activeProducts, searchQuery, selectedOrigin, selectedRoast, selectedProcess, sortBy]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <Coffee className="w-3.5 h-3.5" />
            <span>Specialty Roastery Collection</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900">Bộ Sưu Tập Cà Phê Đặc Sản (SCA 85+)</h2>
          <p className="text-sm text-stone-500 mt-1">
            Tuyển chọn hạt Arabica & Geisha chất lượng cao, rang mộc 100% và xay miễn phí theo dụng cụ pha của bạn.
          </p>
        </div>

        {/* Multi-Dimensional Filter Bar (Origin + Roast Level + Process + Sort - Task 1.2) */}
        <div className="flex flex-wrap items-center gap-2">
          <CustomDropdown
            value={selectedRoast}
            options={ROAST_FILTER_OPTIONS}
            onChange={(val) => setSelectedRoast(val)}
            className="w-44"
            buttonClassName="h-8 px-3 rounded-full text-xs font-semibold shadow-sm"
          />

          <CustomDropdown
            value={selectedProcess}
            options={PROCESS_FILTER_OPTIONS}
            onChange={(val) => setSelectedProcess(val)}
            className="w-48"
            buttonClassName="h-8 px-3 rounded-full text-xs font-semibold shadow-sm"
          />

          <CustomDropdown
            value={sortBy}
            options={SORT_DROPDOWN_OPTIONS}
            onChange={(val) => setSortBy(val)}
            className="w-44"
            buttonClassName="h-8 px-3 rounded-full text-xs font-semibold shadow-sm"
          />
        </div>
      </div>

      {/* Origin Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mr-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5 text-amber-800" />
            <span>Vùng trồng:</span>
          </div>
          {origins.map((origin) => (
            <button
              type="button"
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedOrigin === origin
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {origin === 'ALL' ? 'Tất cả vùng trồng' : origin}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-stone-500">
          Tìm thấy <strong className="text-amber-800">{filteredProducts.length}</strong> dòng hạt phù hợp
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-12 text-center space-y-3">
          <Flame className="w-8 h-8 text-stone-400 mx-auto" />
          <div className="text-sm font-bold text-stone-800">
            Không có sản phẩm nào khớp với bộ lọc hiện tại
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedOrigin('ALL');
              setSelectedRoast('ALL');
              setSelectedProcess('ALL');
            }}
            className="px-4 py-2 rounded-full bg-amber-800 text-white text-xs font-bold"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
