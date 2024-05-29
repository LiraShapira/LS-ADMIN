import { memo } from 'react';
import { Seller } from '../../types/EventTypes';

const SellerItem = ({ seller }: { seller: Seller }) => {
  return (
    <div>
      <span>
        <strong>
          {seller.user.firstName} {seller.user.lastName}:
        </strong>
      </span>
      <span>{seller.productsForSale.join(', ')}</span>
    </div>
  );
};

export default memo(SellerItem);
