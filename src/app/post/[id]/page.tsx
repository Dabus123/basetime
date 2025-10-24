import { Metadata } from 'next';

interface PostPageProps {
  params: {
    id: string;
  };
}

// This would need to be connected to your post storage
// For now, we'll create a placeholder
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postId = params.id;
  
  // In a real implementation, you'd fetch the post data here
  // For now, we'll use a placeholder image
  const imageUrl = `https://gateway.pinata.cloud/ipfs/bafkreibnj5vttoviuflvxr7zpthp365fuebg2elgcpnxa6axvdkabg4kti`;
  
  return {
    title: "BaseTime Post",
    description: "A scheduled post from BaseTime",
    openGraph: {
      title: "BaseTime Post",
      description: "A scheduled post from BaseTime",
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: imageUrl,
        button: {
          title: "View Post",
          action: {
            type: "launch_frame",
            name: "View BaseTime Post",
            url: `https://basetime.app/post/${postId}`,
          },
        },
      }),
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Post {params.id}
        </h1>
        <p className="text-gray-600">
          This is a dynamic post page that includes the image in its meta tags.
        </p>
      </div>
    </div>
  );
}
