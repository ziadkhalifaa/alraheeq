import MediaLibrary from '@/components/admin/MediaLibrary';

export default function MediaTab() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
        <p className="text-gray-500 mt-1">Manage all your images and assets in one place</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <MediaLibrary />
      </div>
    </div>
  );
}
