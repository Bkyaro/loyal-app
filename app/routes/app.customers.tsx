import { useState, useEffect, useCallback, useRef } from "react";
import {
  Page,
  Card,
  Text,
  TextField,
  ResourceList,
  ResourceItem,
  Avatar,
  Badge,
  Spinner,
  Button,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import axios from "axios";
import emptySearch from "../assets/program/ways-to-earn/empty-search.svg";

interface Customer {
  id: number;
  name: string;
  email: string;
  points: number;
  referrals: number;
  vipTier: string | null;
  isMember: boolean;
}

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredCustomerId, setHoveredCustomerId] = useState<number | null>(
    null,
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCustomers = useCallback(async (search?: string, pageNum = 1) => {
    try {
      setLoading(true);

      let url = `http://localhost:3000/users?_page=${pageNum}&_per_page=10`;

      if (search) {
        url = `http://localhost:3000/users?name=${encodeURIComponent(search)}`;
      }

      const response = await axios.get(url);

      // Extract pagination info from headers
      const totalCount = parseInt(response.headers["x-total-count"] || "0", 10);
      const totalPages = Math.ceil(totalCount / 10);

      setTotalPages(totalPages);

      console.log("response.data", response.data);
      // Map API response to our Customer interface
      // 搜索结果拉取

      if (search) {
        if (response.data.length) {
          // 有搜索结果
          const mappedCustomers = response.data.map((user: any) => ({
            id: user.id,
            name: user.name || "N/A",
            email: user.email || "N/A",
            points: user.points_owned || 0,
            referrals: user.referral_count || 0,
            vipTier: user.vip_tier || null,
            isMember: !!user.is_member,
          }));
          setCustomers(mappedCustomers);
        } else {
          // 无搜索结果
          setCustomers([]);
          return;
        }
      }
      // 客户数据拉取
      const mappedCustomers = response.data.data.map((user: any) => ({
        id: user.id,
        name: user.name || "N/A",
        email: user.email || "N/A",
        points: user.points_owned || 0,
        referrals: user.referral_count || 0,
        vipTier: user.vip_tier || null,
        isMember: !!user.is_member,
      }));

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers("", page);
  }, [fetchCustomers, page]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout with delay to reduce API calls
      searchTimeoutRef.current = setTimeout(() => {
        fetchCustomers(value);
      }, 500);
    },
    [fetchCustomers],
  );

  const viewInShopify = useCallback((customerId: number) => {
    window.open(
      `https://admin.shopify.com/store/your-store/customers/${customerId}`,
      "_blank",
    );
  }, []);

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const renderItem = (item: Customer) => {
    const { id, name, email, points, referrals, vipTier, isMember } = item;
    const isHovered = hoveredCustomerId === id;

    return (
      <ResourceItem
        id={String(id)}
        accessibilityLabel={`View details for ${name}`}
        onClick={() => {}} // Required but not used
      >
        <div
          className='flex items-center justify-between'
          onMouseEnter={() => setHoveredCustomerId(id)}
          onMouseLeave={() => setHoveredCustomerId(null)}
        >
          <div className='flex items-center gap-3'>
            <Avatar customer name={name} />
            <div>
              <div className='font-medium'>{name}</div>
              <div className='text-xs text-gray-500'>{email}</div>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div>
              {isMember ? (
                <Badge tone='success'>Member</Badge>
              ) : (
                <Badge tone='info'>Guest</Badge>
              )}
            </div>

            <div>
              <Text as='span'>{points.toLocaleString()} points</Text>
            </div>

            <div>
              <Text as='span'>{referrals} referrals</Text>
            </div>

            <div className='min-w-24'>
              <Text as='span'>{vipTier ? vipTier : "No VIP tier"}</Text>
            </div>

            {isHovered && (
              <div className='ml-4'>
                <Button onClick={() => viewInShopify(id)} variant='plain'>
                  View in Shopify
                </Button>
              </div>
            )}
          </div>
        </div>
      </ResourceItem>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <div className='w-32 h-32 mb-4 relative'>
          <img
            src={emptySearch}
            alt='No customers found'
            className='w-full h-full'
          />
        </div>
        <Text variant='headingMd' as='h2'>
          No customers found
        </Text>
        <div className='mt-2'>
          <Text as='p' variant='bodySm' tone='subdued'>
            Try changing the filters or search term
          </Text>
        </div>
      </div>
    );
  };

  return (
    <Page title='Customers' fullWidth={true}>
      <Card>
        <div className='p-4'>
          <TextField
            label=''
            value={searchValue}
            onChange={handleSearch}
            placeholder='Search customer name or email'
            autoComplete='off'
            prefix={
              loading && (
                <div className='flex items-center pl-2'>
                  <Spinner size='small' />
                </div>
              )
            }
          />
        </div>

        {loading ? (
          <div className='flex justify-center items-center p-8'>
            <Spinner />
          </div>
        ) : customers.length > 0 ? (
          <ResourceList
            resourceName={resourceName}
            items={customers}
            renderItem={renderItem}
          />
        ) : (
          renderEmptyState()
        )}

        {/* Pagination */}
        {!loading && customers.length > 0 && totalPages > 1 && (
          <div className='flex justify-center items-center p-4 gap-2'>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              variant='plain'
            >
              Previous
            </Button>
            <div className='mx-4'>
              Page {page} of {totalPages}
            </div>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              variant='plain'
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </Page>
  );
}
