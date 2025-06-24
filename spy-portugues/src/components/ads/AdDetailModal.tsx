import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';  // Assuming shadcn/ui is set up

import { Ad } from './types';  // Use component's Ad type

const AdDetailModal = ({ ad, onClose }: { ad: Ad; onClose: () => void }) => {
  // Debug logging
  console.log('AdDetailModal rendered with ad:', ad?.id, ad?.headline)
  
  // Safety check for ad data
  if (!ad || !ad.id) {
    console.error('AdDetailModal: Invalid ad data', ad)
    onClose()
    return null
  }
  
  return (
    <Dialog.Root open={true} onOpenChange={(open) => { 
      console.log('Modal open state changed:', open)
      if (!open) onClose(); 
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 animate-in fade-in-0' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-[90%] max-h-[90%] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]'>
          <Dialog.Title className='text-xl font-bold'>{ad.headline || 'Ad Details'}</Dialog.Title>
          <Dialog.Description asChild>
            <div>
              {/* Media Section */}
              {ad.media_type === 'image' && ad.media_url && (
                <div className='my-4'>
                  <Image src={ad.media_url} alt='Ad creative' width={500} height={300} className='rounded-lg' />
                </div>
              )}
              {ad.media_type === 'video' && ad.media_url && (
                <div className='my-4'>
                  <video src={ad.media_url} controls className='w-full rounded-lg'>
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {/* Metadata Section */}
              <div className='my-4'>
                <p><strong>First Seen:</strong> {ad.first_seen}</p>
                <p><strong>Platform:</strong> {ad.platform}</p>
              </div>
              {/* Engagement Metrics Section */}
              <div className='my-4'>
                <p><strong>Likes:</strong> {ad.engagement?.likes || 0}</p>
                <p><strong>Shares:</strong> {ad.engagement?.shares || 0}</p>
              </div>
              <Dialog.Close asChild>
                <Button className='mt-4'>Close</Button>
              </Dialog.Close>
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AdDetailModal; 