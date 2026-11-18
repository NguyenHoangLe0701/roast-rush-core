import React, { useMemo, useState } from 'react';
import { AlertTriangle, Edit3, Plus, Save, X } from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { ProcessMethod, Product, RoastLevel } from '../../../types/domain.types';
import { CustomDropdown, DropdownOption } from '../../../components/common/CustomDropdown';
import { PaginationBar } from '../../../components/common/PaginationBar';

const ROAST_LEVEL_OPTIONS: DropdownOption<RoastLevel>[] = [
  { value: RoastLevel.LIGHT, label: 'Light Roast (Pour Over / V60)' },
  { value: RoastLevel.MEDIUM_LIGHT, label: 'Medium-Light Roast' },
  { value: RoastLevel.MEDIUM, label: 'Medium Roast (Cân bằng)' },
  { value: RoastLevel.MEDIUM_DARK, label: 'Medium-Dark Roast' },
  { value: RoastLevel.DARK, label: 'Dark Roast (Phin / Cold Brew)' },
];

const PROCESS_METHOD_OPTIONS: DropdownOption<ProcessMethod>[] = [
  { value: ProcessMethod.WASHED, label: 'Washed (Chế biến ướt)' },
  { value: ProcessMethod.NATURAL, label: 'Natural (Phơi tự nhiên)' },
  { value: ProcessMethod.HONEY, label: 'Honey Process (Mật ong)' },
  { value: ProcessMethod.ANAEROBIC_FERMENTATION, label: 'Anaerobic Fermentation (Yếm khí)' },
  { value: ProcessMethod.CARBONIC_MACERATION, label: 'Carbonic Maceration' },
];

interface AdminProductsTabProps {
  filteredProducts: Product[];
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({ filteredProducts }) => {
  const { updateProductStock, updateProductPriceAndStatus, updateFullProduct, createNewProduct } =
    useRoastRush();

  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Add New Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOrigin, setNewOrigin] = useState('Ethiopia');
  const [newRegion, setNewRegion] = useState('Yirgacheffe');
  const [newVarietal, setNewVarietal] = useState('Heirloom');
  const [newAltitude, setNewAltitude] = useState('2,100m');
  const [newSca, setNewSca] = useState('88.5');
  const [newPrice, setNewPrice] = useState('550000');
  const [newStock, setNewStock] = useState('30');
  const [newDesc, setNewDesc] = useState('Hương hoa nhài, đào trắng và cam Bergamot thanh khiết.');
  const [newNotes, setNewNotes] = useState('Jasmine, Peach, Bergamot');

  // Slide-over Edit Product Drawer State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editOrigin, setEditOrigin] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editSca, setEditSca] = useState('');
  const [editRoast, setEditRoast] = useState<RoastLevel>(RoastLevel.LIGHT);
  const [editProcess, setEditProcess] = useState<ProcessMethod>(ProcessMethod.WASHED);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const openEditDrawer = (p: Product) => {
    const sku = p.skus[0];
    setEditingProduct(p);
    setEditName(p.name);
    setEditOrigin(p.coffeeMetadata.originCountry);
    setEditRegion(p.coffeeMetadata.region);
    setEditSca(String(p.coffeeMetadata.cuppingScore));
    setEditRoast(p.coffeeMetadata.roastLevel);
    setEditProcess(p.coffeeMetadata.processMethod);
    setEditPrice(String(sku.basePriceVnd));
    setEditStock(String(sku.availableStock));
    setEditDesc(p.shortDescription);
  };

  const handleSaveEditDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateFullProduct(
      editingProduct.id,
      {
        name: editName.trim() || editingProduct.name,
        shortDescription: editDesc.trim(),
        coffeeMetadata: {
          ...editingProduct.coffeeMetadata,
          originCountry: editOrigin.trim(),
          region: editRegion.trim(),
          cuppingScore: parseFloat(editSca) || editingProduct.coffeeMetadata.cuppingScore,
          roastLevel: editRoast,
          processMethod: editProcess,
        },
      },
      {
        basePriceVnd: parseInt(editPrice, 10) || editingProduct.skus[0].basePriceVnd,
        availableStock: parseInt(editStock, 10) ?? editingProduct.skus[0].availableStock,
      }
    );
    setEditingProduct(null);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createNewProduct({
      name: newName.trim(),
      originCountry: newOrigin.trim(),
      region: newRegion.trim(),
      varietal: newVarietal.trim(),
      altitudeMasl: newAltitude.trim(),
      cuppingScore: parseFloat(newSca) || 88.0,
      basePriceVnd: parseInt(newPrice, 10) || 450000,
      availableStock: parseInt(newStock, 10) || 25,
      shortDescription: newDesc.trim(),
      tastingNotes: newNotes.split(',').map((s) => s.trim()).filter(Boolean),
      thumbnailUrl:
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    });
    setNewName('');
    setShowAddModal(false);
  };

  const displayList = useMemo(() => {
    const base = onlyLowStock
      ? filteredProducts.filter((p) => (p.skus[0]?.availableStock ?? 0) < 30)
      : filteredProducts;
    return base;
  }, [filteredProducts, onlyLowStock]);

  const pagedProducts = useMemo(() => {
    const start = page * pageSize;
    return displayList.slice(start, start + pageSize);
  }, [displayList, page, pageSize]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Danh mục Hạt Cà Phê Đặc Sản (SCA 85+)</h2>
            <p className="text-xs text-stone-500">
              Theo dõi tồn kho, phiên bản khóa lạc quan JPA @Version và chỉnh sửa thông số hạt
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOnlyLowStock(!onlyLowStock);
                setPage(0);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                onlyLowStock
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Lọc sắp hết kho (&lt; 30 túi)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(!showAddModal)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm mới</span>
            </button>
          </div>
        </div>

        {showAddModal && (
          <form
            onSubmit={handleAddProductSubmit}
            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs"
          >
            <h3 className="text-sm font-bold text-stone-900">Thêm dòng hạt Cà phê Đặc sản mới</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Kenya Nyeri AA Top"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Quốc gia</label>
                <input
                  type="text"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Vùng trồng</label>
                <input
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Điểm SCA</label>
                <input
                  type="number"
                  step="0.1"
                  value={newSca}
                  onChange={(e) => setNewSca(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Giá bán 250g (VNĐ)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Số lượng nhập kho</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-semibold"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-800 text-white font-bold"
              >
                Lưu sản phẩm
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 font-semibold">Sản phẩm</th>
                <th className="py-3 font-semibold">Xuất xứ & SCA</th>
                <th className="py-3 font-semibold">Giá bán 250g (VNĐ)</th>
                <th className="py-3 font-semibold">Tồn kho & @Version</th>
                <th className="py-3 font-semibold">Trạng thái</th>
                <th className="py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pagedProducts.map((product) => {
                const sku = product.skus[0];
                const isLow = sku.availableStock < 30;
                return (
                  <tr key={product.id} className="hover:bg-stone-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{product.name}</div>
                          <div className="font-mono text-[11px] text-stone-500">{sku.skuCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-stone-700">
                      {product.coffeeMetadata.originCountry} •{' '}
                      <strong className="text-amber-800">
                        SCA {product.coffeeMetadata.cuppingScore}
                      </strong>
                    </td>
                    <td className="py-4">
                      <input
                        type="number"
                        step={10000}
                        value={sku.basePriceVnd}
                        onChange={(e) =>
                          updateProductPriceAndStatus(
                            product.id,
                            Number(e.target.value),
                            product.active
                          )
                        }
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-stone-300 font-bold text-stone-900"
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{sku.availableStock} túi</span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-mono text-[10px]">
                          v{sku.version}
                        </span>
                        {isLow && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            Sắp hết
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateProductPriceAndStatus(product.id, sku.basePriceVnd, !product.active)
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          product.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                      >
                        {product.active ? 'Đang bán' : 'Tạm ẩn'}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditDrawer(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateProductStock(product.id, sku.availableStock + 10)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-800 text-white font-bold transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+10 túi</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <PaginationBar
          page={page}
          size={pageSize}
          totalElements={displayList.length}
          onPageChange={setPage}
          onSizeChange={(s) => {
            setPageSize(s);
            setPage(0);
          }}
        />
      </div>

      {/* =====================================================================
          SLIDE-OVER EDIT PRODUCT DRAWER (Task 2.3)
      ===================================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          <form
            onSubmit={handleSaveEditDrawer}
            className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between text-xs"
          >
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-stone-900">Chỉnh sửa Chi tiết Hạt</h3>
                <span className="font-mono text-[11px] text-stone-500">
                  SKU: {editingProduct.skus[0].skuCode} • JPA @Version: v{editingProduct.skus[0].version}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quốc gia</label>
                  <input
                    type="text"
                    value={editOrigin}
                    onChange={(e) => setEditOrigin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Vùng trồng</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Mức độ rang (Roast Level)</label>
                  <CustomDropdown
                    value={editRoast}
                    options={ROAST_LEVEL_OPTIONS}
                    onChange={(val) => setEditRoast(val)}
                    align="left"
                    buttonClassName="h-10 px-3 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Phương pháp sơ chế</label>
                  <CustomDropdown
                    value={editProcess}
                    options={PROCESS_METHOD_OPTIONS}
                    onChange={(val) => setEditProcess(val)}
                    align="right"
                    buttonClassName="h-10 px-3 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Điểm SCA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editSca}
                    onChange={(e) => setEditSca(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-amber-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Giá 250g (VNĐ)</label>
                  <input
                    type="number"
                    step={10000}
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tồn kho (túi)</label>
                  <input
                    type="number"
                    min={0}
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Lưu & Tăng @Version</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

