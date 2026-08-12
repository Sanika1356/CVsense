import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div className="dashboard-bg min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
    }

    if (error) {
        return <div className="dashboard-bg min-h-screen flex items-center justify-center text-violet-300">Error {error}</div>;
    }

    return (
        <div className="dashboard-bg min-h-screen p-8 flex flex-col gap-6">
            <p className="text-slate-400 text-sm">Authenticated as: <span className="text-slate-200 font-medium">{auth.user?.username}</span></p>
            <div className="panel p-6">
                <p className="section-eyebrow mb-4">Existing files</p>
                <div className="flex flex-col gap-2">
                    {files.map((file) => (
                        <div key={file.id} className="flex flex-row gap-4 text-slate-300 text-sm">
                            <p>{file.name}</p>
                        </div>
                    ))}
                    {files.length === 0 && <p className="text-slate-500 text-sm">No files.</p>}
                </div>
            </div>
            <div>
                <button
                    className="secondary-button text-accent-violet border-accent-violet/30 hover:bg-accent-violet/10"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;
