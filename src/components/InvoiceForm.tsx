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
import { RemoveIcon } from "./removeIcon";
import { AddIcon } from "./addIcon";

import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import toast from "react-hot-toast";

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

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [currencyIcon, setCurrency] = useState(new Set([]));
  const [invoicePDF, setInvoicePDF] = useState<JSX.Element | null>(null);

  // Sender Details
  const [senderName, setSenderName] = useState<string>("");
  const [senderEmail, setSenderEmail] = useState<string>("");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>();
  const [dueDate, setDueDate] = useState<string>();

  // Customer Details
  const [customerFName, setCustomerFName] = useState<string>("");
  const [customerLName, setCustomerLName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  // Invoice Items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem>([]);

  // Payout Details
  const [bankDetails, setBankDetails] = useState<String>("");
  const [paypalAddress, setPaypalAddres] = useState<String>("");
  const [walletAddress, setWalletAddress] = useState<String>("");

  // Additional Details
  const [additionalDetails, setAdditionalDetails] = useState<String>("");

  const createItem = () => {
    const total = quantity * price * (1 + tax / 100);

    // Create new invoice item object
    const newItem = {
      name: itemName,
      quantity: quantity,
      tax: tax,
      unitprice: price,
      total: total,
      currency: currency,
    };

    // Add new item to invoice items array
    setInvoiceItems([...invoiceItems, newItem]);

    // Clear input fields
    setItemName("");
    setQuantity(0);
    setPrice(0);
    setTax(0);
    setCurrency(new Set([]));
  };

  const handleSelectionChange = (e: any) => {
    setCurrency(new Set(e.target.value.split(",")));
  };

  const removeItem = (index: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems.splice(index, 1);
    setInvoiceItems(updatedItems);
  };

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      padding: 20,
      fontSize: 12,
    },
    header: {
      fontSize: 20,
      marginBottom: 20,
    },
    section: {
      marginBottom: 10,
    },
    item: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
    },
    itemName: {
      flex: 2,
    },
    itemQuantity: {
      flex: 1,
    },
    itemPrice: {
      flex: 1,
    },
    itemTotal: {
      flex: 1,
    },
  });

  const generateInvoicePDF = () => {
    const grandTotal = invoiceItems.reduce(
      (total, item) => +total + +item.total,
      0,
    );

    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Invoice</Text>
            <Text>Invoice Number: {invoiceNumber}</Text>
            <Text>Invoice Date: {invoiceDate}</Text>
            <Text>Invoice Due Date: {dueDate}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Customer Details</Text>
            <Text>
              Customer Name: {customerFName} {customerLName}
            </Text>
            <Text>Address: {customerAddress}</Text>
            <Text>Email: {customerEmail}</Text>
            <Text>Phone: {customerPhone}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Invoice Items</Text>
            <View style={styles.item}>
              <Text style={styles.itemName}>Item Name</Text>
              <Text style={styles.itemQuantity}>Quantity</Text>
              <Text style={styles.itemPrice}>Unit Price</Text>
              <Text style={styles.itemPrice}>Tax</Text>
              <Text style={styles.itemTotal}>Total</Text>
            </View>
            {/* Example item */}
            {invoiceItems.map((item, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity.toString()}
                </Text>
                <Text style={styles.itemPrice}>
                  {currencyIcon}
                  {item.unitprice.toString()}
                </Text>
                <Text style={styles.itemPrice}>{item.tax.toString()}%</Text>
                <Text style={styles.itemTotal}>
                  {currencyIcon}
                  {item.total.toString()}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Total</Text>
            <Text>
              Total Amount: {currencyIcon}
              {grandTotal}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Bank Details & other</Text>
            <Text>{bankDetails}</Text>
            <Text>Paypal Address: {paypalAddress}</Text>
            <Text>Crypto Wallet: {walletAddress}</Text>
          </View>
        </Page>
      </Document>
    );
    setInvoicePDF(MyDocument);
    toast.success("Invoice PDF generated!");
  };

  return (
    <>
      <h1 className="mb-4 py-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Invoice Generator
      </h1>
      <Card className="w-full max-w-3xl px-5">
        <CardHeader>
          <p className="text-small text-default-500">
            Enter the details to generate your invoice.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <h3 className="py-2">Your Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Your Name"
                className="input"
                onChange={(e) => setSenderName(e.target.value)}
                id="yourName"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Your Email"
                className="input"
                onChange={(e) => setSenderEmail(e.target.value)}
                id="yourEmail"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <h3 className="py-2">Customer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Customer First Name"
                className="input"
                onChange={(e) => setCustomerLName(e.target.value)}
                id="customerFName"
                placeholder="Enter customer's name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Last Name"
                className="input"
                onChange={(e) => setCustomerFName(e.target.value)}
                id="customerLName"
                placeholder="Enter customer's name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Email"
                className="input"
                onChange={(e) => setCustomerEmail(e.target.value)}
                id="customerEmail"
                placeholder="Enter customer's email"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Customer Phone"
                className="input"
                onChange={(e) => setCustomerPhone(e.target.value)}
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
              onChange={(e) => setCustomerAddress(e.target.value)}
              id="customerAddress"
              placeholder="Enter customer's address"
            />
          </div>
          <h4 className="py-2">Invoice Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Input
                label="Invoice Number"
                className="input"
                onChange={(e) => setInvoiceNumber(e.target.value)}
                id="invoiceNumber"
                placeholder="Enter invoice number"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Invoice Date"
                className="input"
                onChange={(e) => setInvoiceDate(e.target.value)}
                id="invoiceDate"
                placeholder="Select invoice date"
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Due Date"
                className="input"
                onChange={(e) => setDueDate(e.target.value)}
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
          <div className="space-y-2">
            <Button isIconOnly onPress={onOpen} color="primary">
              <AddIcon />
            </Button>
          </div>
          <h4 className="py-2">Enter Payout Details</h4>
          <div className="space-y-2">
            <Select
              variant="flat"
              items={currency}
              labelPlacement="outside"
              label="Currency"
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
          </div>
          <div className="space-y-2">
            <Textarea
              label="Bank Details"
              className="input"
              onChange={(e) => setBankDetails(e.target.value)}
              id="bankDetails"
              placeholder="Enter bank details"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="PayPal Address"
                className="input"
                onChange={(e) => setPaypalAddres(e.target.value)}
                id="paypalAddress"
                placeholder="Enter PayPal address"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Crypto Wallet"
                className="input"
                onChange={(e) => setWalletAddress(e.target.value)}
                id="cryptoAddress"
                placeholder="Enter crypto wallet address"
              />
            </div>
          </div>
          <h4 className="py-2">Additional Details</h4>
          <div className="space-y-2">
            <Textarea
              className="input"
              onChange={(e) => setAdditionalDetails(e.target.value)}
              id="notes"
              placeholder="Enter additional notes"
            />
          </div>
        </CardBody>
        <CardFooter className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button onPress={generateInvoicePDF} color="success">
              Generate PDF
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Modal
        backdrop="opaque"
        isOpen={invoicePDF !== null}
        onOpenChange={() => setInvoicePDF(null)}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invoice PDF Preview
              </ModalHeader>
              <ModalBody>
                {invoicePDF && (
                  <PDFViewer style={{ width: "100%", height: "600px" }}>
                    {invoicePDF}
                  </PDFViewer>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => setInvoicePDF(null)}>
                  Close Preview
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
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
