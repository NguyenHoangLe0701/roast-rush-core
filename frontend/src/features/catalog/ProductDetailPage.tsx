import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Coffee,
  Minus,
  Mountain,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { GrindOption } from '../../types/domain.types';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';
import { GRIND_DROPDOWN_OPTIONS } from './CatalogSection';

const RATING_DROPDOWN_OPTIONS: DropdownOption<number>[] = [
  { value: 5, label: '★★★★★ (5/5 - Xuất sắc)' },
  { value: 4, label: '★★★★☆ (4/5 - Rất ngon)' },
  { value: 3, label: '★★★☆☆ (3/5 - Khá)' },
];

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setActivePage,
    selectedGrind,
    setGrindForProduct,
    addCatalogProductToCart,
    products,
    openProductDetail,
    reviews,
    addProductReview,
  } = useRoastRush();

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<number>(250);
  const [brewCups, setBrewCups] = useState<number>(2);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewBrewMethod, setReviewBrewMethod] = useState<string>('Pour Over V60');
  const [reviewComment, setReviewComment] = useState<string>('');

  if (!selectedProduct) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-stone-500">Không tìm thấy thông tin sản phẩm.</p>
        <button
          onClick={() => setActivePage('CATALOG')}
          className="px-5 py-2.5 rounded-full bg-amber-800 text-white text-xs font-bold"
        >
          Quay lại danh mục
        </button>
      </div>
    );
  }

  const sku = selectedProduct.skus[0];
  const meta = selectedProduct.coffeeMetadata;
  const currentGrind = selectedGrind[selectedProduct.id] || GrindOption.WHOLE_BEAN;

  const weightMultiplier = selectedWeight === 500 ? 1.9 : selectedWeight === 1000 ? 3.6 : 1;
  const calculatedUnitPrice = Math.round(sku.basePriceVnd * weightMultiplier);

  const relatedProducts = products.filter((p) => p.id !== selectedProduct.id).slice(0, 3);

  const handleBuyNow = () => {
    addCatalogProductToCart(selectedProduct, quantity, selectedWeight);
    setActivePage('CHECKOUT');
  };

  return (
    <div className="space-y-12">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('CATALOG')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bộ sưu tập Cà phê Đặc sản</span>
        </button>

        <div className="text-xs text-stone-400">
          Mã SKU: <span className="font-mono text-stone-700 font-semibold">{sku.skuCode}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
        {/* Left Image Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative">
            <img
              src={selectedProduct.thumbnailUrl}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 shadow">
              <Award className="w-4 h-4 text-amber-700" />
              <span>SCA Cupping Score: {meta.cuppingScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500">Mức độ rang</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{meta.roastLevel}</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500">Sơ chế</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{meta.processMethod}</div>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500">Độ cao trồng</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{meta.altitudeMasl}</div>
            </div>
          </div>
        </div>

        {/* Right Product Details & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span>{meta.originCountry}</span>
              <span>•</span>
              <span>{meta.region}</span>
              <span>•</span>
              <span>Giống hạt: {meta.varietal}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {selectedProduct.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-800">
                {formatVnd(calculatedUnitPrice)}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                / Túi {selectedWeight}g (Còn {sku.availableStock} túi trong kho)
              </span>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">{selectedProduct.shortDescription}</p>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-800" />
                <span>Tầng hương vị đặc trưng (Tasting Notes):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {meta.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full bg-white text-amber-900 border border-amber-200 text-xs font-bold shadow-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Weight Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                1. Chọn quy cách đóng gói
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { weight: 250, label: 'Túi 250g', desc: 'Tiêu chuẩn' },
                  { weight: 500, label: 'Túi 500g', desc: 'Tiết kiệm 5%' },
                  { weight: 1000, label: 'Túi 1kg (Roastery)', desc: 'Tiết kiệm 10%' },
                ].map((opt) => (
                  <button
                    key={opt.weight}
                    type="button"
                    onClick={() => setSelectedWeight(opt.weight)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedWeight === opt.weight
                        ? 'border-amber-800 bg-amber-50/50 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[11px] text-amber-800 font-medium">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                2. Chọn cỡ xay theo dụng cụ pha (Miễn phí)
              </label>
              <CustomDropdown
                value={currentGrind}
                options={GRIND_DROPDOWN_OPTIONS}
                onChange={(val) => setGrindForProduct(selectedProduct.id, val)}
                align="left"
                buttonClassName="h-12 px-4 rounded-2xl text-sm font-semibold shadow-sm"
              />
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-stone-600 hover:text-stone-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-black text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(sku.availableStock, q + 1))}
                  className="p-3 text-stone-600 hover:text-stone-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addCatalogProductToCart(selectedProduct, quantity, selectedWeight)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm vào giỏ ({formatVnd(calculatedUnitPrice * quantity)})</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition"
              >
                Mua ngay
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-500 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rang mộc 100% không tẩm ướp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Giao nhanh toàn quốc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Túi khóa Zip có van 1 chiều Thụy Sĩ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Axis SCA Sensory Profile & Interactive Brewing Calculator (Tasks 1.1 & 1.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: 5-Axis SCA Flavor Sensory Profile */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-black text-stone-900">Hồ Sơ Thử Nếm 5 Trục (SCA Sensory Profile)</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Đánh giá bởi Q-Grader tại phòng Lab RoastRush
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold">
              SCA {meta.cuppingScore}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              {
                label: 'Hương thơm (Fragrance / Aroma)',
                score: meta.cuppingScore >= 90 ? 96 : 91,
                desc: meta.tastingNotes.slice(0, 2).join(', '),
              },
              {
                label: 'Độ chua thanh (Acidity Brightness)',
                score: meta.roastLevel === 'LIGHT' ? 92 : 82,
                desc: meta.roastLevel === 'LIGHT' ? 'Chua thanh trái cây nhiệt đới' : 'Chua dịu cân bằng',
              },
              {
                label: 'Độ ngọt tự nhiên (Sweetness)',
                score: 94,
                desc: 'Mật hoa, đường nâu & trái chín',
              },
              {
                label: 'Độ dày vị (Body / Mouthfeel)',
                score: meta.roastLevel === 'MEDIUM' ? 88 : 80,
                desc: meta.roastLevel === 'MEDIUM' ? 'Đậm đà, tròn vị' : 'Mượt mà như trà Ô long',
              },
              {
                label: 'Hậu vị (Aftertaste)',
                score: 93,
                desc: 'Ngọt kéo dài, sạch và thanh khiết',
              },
            ].map((axis) => (
              <div key={axis.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">{axis.label}</span>
                  <span className="text-stone-500">{axis.desc}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-800"
                    style={{ width: `${axis.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-900">Câu chuyện Nông trại:</strong> {selectedProduct.storyMarkdown}
          </div>
        </div>

        {/* Right 6 cols: Interactive Brewing Ratio Calculator */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Máy Tính Công Thức Pha Chế (Brewing Calculator)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tự động tính lượng hạt & lượng nước theo số tách bạn muốn pha (Tỷ lệ vàng 1:15)
                </p>
              </div>
              <Coffee className="w-5 h-5 text-amber-800 shrink-0" />
            </div>

            {/* Cup Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Chọn số tách cà phê muốn pha:
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((cups) => (
                  <button
                    key={cups}
                    type="button"
                    onClick={() => setBrewCups(cups)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                      brewCups === cups
                        ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-800'
                    }`}
                  >
                    {cups} Tách ({cups * 15}g)
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Recipe Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center pt-1">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="text-[11px] text-amber-900 font-semibold">Lượng cà phê</div>
                <div className="text-xl font-black text-amber-900 mt-0.5">{brewCups * 15}g</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="text-[11px] text-amber-900 font-semibold">Tổng lượng nước</div>
                <div className="text-xl font-black text-amber-900 mt-0.5">{brewCups * 225}ml</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="text-[11px] text-amber-900 font-semibold">Nhiệt độ nước</div>
                <div className="text-xl font-black text-amber-900 mt-0.5">92°C</div>
              </div>
            </div>

            {/* 3-Step Pouring Guide */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="font-bold text-stone-800">Các bước rót nước chuẩn V60:</div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span>1. <strong>Ủ cà phê (Bloom 0:00 - 0:45):</strong> Rót đều làm ướt bột</span>
                <span className="font-mono font-bold text-amber-800">{brewCups * 45}ml</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span>2. <strong>Lần rót 2 (0:45 - 1:30):</strong> Rót xoắn ốc từ tâm ra ngoài</span>
                <span className="font-mono font-bold text-amber-800">đến {brewCups * 135}ml</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span>3. <strong>Lần rót 3 (1:30 - 2:20):</strong> Rót nhẹ giữ mực nước ổn định</span>
                <span className="font-mono font-bold text-amber-800">đến {brewCups * 225}ml</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Cupping Reviews Section (Task 2.5) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-stone-900">
              Đánh giá hương vị từ Khách hàng ({reviews.filter((r) => r.productId === selectedProduct.id).length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Chia sẻ trải nghiệm chiết xuất thực tế của bạn với mẻ rang này
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
            ★ 5.0 / 5.0 Tuyệt hảo
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {reviews
            .filter((r) => r.productId === selectedProduct.id)
            .map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{rev.authorName}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-amber-800 font-semibold text-[11px]">
                      {rev.brewMethod}
                    </span>
                  </div>
                  <span className="text-stone-400">{rev.createdAt}</span>
                </div>
                <div className="text-amber-500 text-xs">{'★'.repeat(rev.rating)}</div>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
        </div>

        {/* Submit New Review Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reviewComment.trim()) return;
            addProductReview(selectedProduct.id, reviewRating, reviewBrewMethod, reviewComment.trim());
            setReviewComment('');
          }}
          className="pt-4 border-t border-stone-100 space-y-3 text-xs"
        >
          <div className="font-bold text-stone-800">Gửi nhận xét hương vị của bạn</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-stone-600 font-medium block mb-1">Dụng cụ pha bạn sử dụng</label>
              <input
                type="text"
                value={reviewBrewMethod}
                onChange={(e) => setReviewBrewMethod(e.target.value)}
                placeholder="VD: Pour Over V60, Espresso..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
              />
            </div>
            <div>
              <label className="text-stone-600 font-medium block mb-1">Chấm điểm hương vị</label>
              <CustomDropdown
                value={reviewRating}
                options={RATING_DROPDOWN_OPTIONS}
                onChange={(val) => setReviewRating(Number(val))}
                align="left"
                buttonClassName="h-10 px-3.5 rounded-xl text-xs font-semibold text-amber-800 shadow-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Cảm nhận của bạn về hương thơm, độ chua thanh và hậu vị..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold transition shrink-0"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>

      {/* Related Products */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-stone-900">Các dòng hạt Đặc sản khác bạn có thể thích</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => openProductDetail(item)}
              className="rounded-2xl bg-white border border-stone-200 p-4 flex items-center gap-4 cursor-pointer hover:border-amber-800 transition"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs text-amber-800 font-bold">{item.coffeeMetadata.originCountry}</div>
                <div className="text-sm font-bold text-stone-900 truncate">{item.name}</div>
                <div className="text-xs font-black text-stone-800 mt-0.5">
                  {formatVnd(item.skus[0].basePriceVnd)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

