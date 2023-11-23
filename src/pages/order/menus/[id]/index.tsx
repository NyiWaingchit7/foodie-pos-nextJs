import AddonCategories from "@/pages/component/AddonCategories";
import QuantitySelector from "@/pages/component/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slice/cartSlice";
import { CartItem } from "@/types/cart";
import { Box, Button } from "@mui/material";
import { Addon } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const { query, isReady, ...router } = useRouter();
  const menus = useAppSelector((state) => state.menu.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const menuId = Number(query.id);
  const cartItemId = query.cartItemId;
  const cartItem = cartItems.find((item) => item.id === cartItemId);
  const menu = menus.find((item) => item.id === menuId);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const allMenuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const addonCategoryIds = allMenuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((item) => item.addonCategoryId);
  const addonCategories = useAppSelector(
    (state) => state.addonCategory.items
  ).filter((item) => addonCategoryIds.includes(item.id));
  const dispatch = useAppDispatch();

  useEffect(() => {
    const requiredAddonCategories = addonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequiredAddons = selectedAddons.filter((selectedAddon) => {
      const addonCategory = addonCategories.find(
        (item) => item.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });
    const isDisabled =
      requiredAddonCategories.length !== selectedRequiredAddons.length;
    setIsDisabled(isDisabled);
  }, [selectedAddons, addonCategories]);

  useEffect(() => {
    if (cartItem) {
      const { addons, quantity } = cartItem;
      setSelectedAddons(addons);
      setQuantity(quantity);
    }
  }, [cartItem]);

  const handleQuantityDecrease = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };

  const handleQuantityIncrease = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    if (!menu) return;
    const newCartItem: CartItem = {
      id: cartItem ? cartItem.id : nanoid(7),
      menu,
      addons: selectedAddons,
      quantity,
    };
    dispatch(addToCart(newCartItem));
    const pathname = cartItem ? "/order/cart" : "/order";
    router.push({ pathname, query });
  };

  if (!isReady || !menu) return null;

  return (
    <Box sx={{ position: "relative", zIndex: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Image
          src={menu.assetUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddonCategories
            addonCategories={addonCategories}
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
          />
          <QuantitySelector
            value={quantity}
            onDecrease={handleQuantityDecrease}
            onIncrease={handleQuantityIncrease}
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleAddToCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            {cartItem ? "Update cart" : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuDetail;
