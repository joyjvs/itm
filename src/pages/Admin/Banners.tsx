import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { PaginationControls } from "@/components/common/PaginationControls";
import { BannerModal } from "@/components/forms/Admin/Banners/BannerModal";
import { BannerList } from "@/components/forms/Admin/Banners/BannerList";
import { useBanners } from "@/hooks/useBanners";
import { Banner } from "@/types/banner.types";

export const BannersPage = () => {
  const {
    banners,
    fetchBanners,
    deleteBanner,
    isLoading,
    pagination,
    setPage,
    setLimit,
  } = useBanners();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    void fetchBanners();
  }, [fetchBanners]);

  const requestDelete = (id: string) => {
    setBannerIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bannerIdToDelete) return;
    await deleteBanner(bannerIdToDelete);
    setDeleteDialogOpen(false);
    setBannerIdToDelete(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Banners</h1>
          <Button
            onClick={() => {
              setSelectedBanner(null);
              setModalOpen(true);
            }}
          >
            + Nuevo
          </Button>
        </div>
        <BannerList
          banners={banners}
          isLoading={isLoading}
          onEdit={(banner) => {
            setSelectedBanner(banner);
            setModalOpen(true);
          }}
          onDelete={requestDelete}
        />
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages || 1}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
        />
        <BannerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          banner={selectedBanner}
          onSuccess={() => void fetchBanners()}
        />
        <ConfirmAlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Eliminar banner"
          description="Esta acción eliminará el banner seleccionado. ¿Deseas continuar?"
          confirmText="Eliminar banner"
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default BannersPage;
