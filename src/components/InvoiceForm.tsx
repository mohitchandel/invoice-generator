"use client";
import { useState } from "react";
import {
  CardHeader,
  CardFooter,
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Link,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { RemoveIcon } from "./removeIcon";

type InvoiceItem = {
  name: String;
  quantity: Number;
  tax: Number;
  unitprice: Number;
  total: Number;
}[];

export default function Component() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const currency = [
    {
      label: "USD",
      symbol: "$",
    },
    {
      label: "EUR",
      symbol: "€",
    },
    {
      label: "GBP",
      symbol: "£",
    },
    {
      label: "INR",
      symbol: "₹",
    },
    {
      label: "AED",
      symbol: "د.إ",
    },
  ];

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [currencyIcon, setCurrency] = useState(new Set([]));

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem>([]);

  const createItem = () => {
    const total = quantity * price * (1 + tax / 100);

    // Create new invoice item object
    const newItem = {
      name: name,
      quantity: quantity,
      tax: tax,
      unitprice: price,
      total: total,
      currency: currency,
    };

    // Add new item to invoice items array
    setInvoiceItems([...invoiceItems, newItem]);

    // Clear input fields
    setName("");
    setQuantity(0);
    setPrice(0);
    setTax(0);
    setCurrency(new Set([]));
  };

  const handleSelectionChange = (e: any) => {
    setCurrency(new Set(e.target.value.split(",")));
  };

  const removeItem = (index: any) => {
    // Create a copy of the current invoice items array
    const updatedItems = [...invoiceItems];

    // Remove the item at the specified index
    updatedItems.splice(index, 1);

    // Update the state with the updated array
    setInvoiceItems(updatedItems);
  };

  return (
    <>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="text-small text-default-500">
            Enter the details to generate your invoice.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <h3>Customer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Customer Name"
                className="input"
                id="customerName"
                placeholder="Enter customer's name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Last Name"
                className="input"
                id="customerLName"
                placeholder="Enter customer's name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Email"
                className="input"
                id="customerEmail"
                placeholder="Enter customer's email"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Phone"
                className="input"
                id="customerPhone"
                placeholder="Enter customer's phone"
                type="tel"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Textarea
              label="Customer Address"
              className="input"
              id="bankDetails"
              placeholder="Enter customer's address"
            />
          </div>
          <h4>Invoice Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Input
                label="Invoice Number"
                className="input"
                id="invoiceNumber"
                placeholder="Enter invoice number"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Invoice Date"
                className="input"
                id="invoiceDate"
                placeholder="Select invoice date"
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Due Date"
                className="input"
                id="dueDate"
                placeholder="Select due date"
                type="date"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Item
                  </th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Tax
                  </th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.quantity.toFixed(2)}</td>
                    <td className="px-4 py-2">{item.tax.toFixed(2)}</td>
                    <td className="px-4 py-2">${item.unitprice.toFixed(2)}</td>
                    <td className="px-4 py-2">${item.total.toFixed(2)}</td>
                    <td className="px-1 py-2">
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        aria-label="Remove"
                        onPress={() => removeItem(index)}
                      >
                        <RemoveIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>Enter Payout Details</h4>
          <div className="space-y-2">
            <Textarea
              label="Bank Details"
              className="input"
              id="bankDetails"
              placeholder="Enter bank details"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="PayPal Address"
                className="input"
                id="paypalAddress"
                placeholder="Enter PayPal address"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Crypto Wallet"
                className="input"
                id="cryptoAddress"
                placeholder="Enter crypto wallet address"
              />
            </div>
          </div>
          <h4>Additional Details</h4>
          <div className="space-y-2">
            <Textarea
              className="input"
              id="notes"
              placeholder="Enter additional notes"
            />
          </div>
        </CardBody>
        <CardFooter className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button color="success">Send Invoice</Button>
            <Button onPress={onOpen} color="primary">
              Add Item
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  placeholder="Enter Item Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Quantity"
                  placeholder="Enter Item Quantity"
                  type="number"
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <Input
                  label="Price"
                  placeholder="Enter Item Price"
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
                <Input
                  label="Tax"
                  placeholder="Enter tax %"
                  type="number"
                  value={tax.toString()}
                  onChange={(e) => setTax(parseInt(e.target.value))}
                />
                <Select
                  variant="flat"
                  items={currency}
                  labelPlacement="outside"
                  label="Favorite Animal"
                  placeholder="Select Currency"
                  selectedKeys={currencyIcon}
                  onChange={handleSelectionChange}
                >
                  {(currency) => (
                    <SelectItem style={{ color: "#000" }} key={currency.symbol}>
                      {currency.label}
                    </SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={createItem}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
