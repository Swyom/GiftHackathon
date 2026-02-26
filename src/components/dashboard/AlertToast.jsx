import { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // npm install react-hot-toast

const AlertToast = ({ socket }) => {
    useEffect(() => {
        socket.on('drastic_event', (data) => {
            toast.error((t) => (
                <span>
                    <b>🚨 {data.title}</b>: {data.message}
                    <button className="ml-4 border px-2 rounded" onClick={() => toast.dismiss(t.id)}>Dismiss</button>
                </span>
            ), { duration: 10000, position: 'top-right' });
        });
        return () => socket.off('drastic_event');
    }, [socket]);

    return <Toaster />;
};