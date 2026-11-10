<?php

namespace App\Traits;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

trait ApiResponse
{
    /**
     * Send a standardized success API response.
     *
     * @param  array{currentPage?: int, limit?: int, totalResult?: int, totalPages?: int}|null  $meta
     */
    public function sendResponse(
        mixed $results = null,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        ?array $meta = null
    ): JsonResponse {
        return self::formatResponse($results, $message, $statusCode, $meta);
    }

    /**
     * Send a standardized paginated API response.
     *
     * @param  mixed  $items  Optional custom items if transformed
     */
    public function sendPaginatedResponse(
        LengthAwarePaginator|Paginator $paginator,
        string $message = 'Items retrieved successfully.',
        int $statusCode = 200,
        mixed $items = null
    ): JsonResponse {
        return self::formatPaginatedResponse($paginator, $message, $statusCode, $items);
    }

    /**
     * Send a standardized error API response.
     *
     * @param  list<array{path: string, message: string}>  $errorMessages
     */
    public function sendError(
        string $message = 'An error occurred.',
        int $statusCode = 400,
        array $errorMessages = []
    ): JsonResponse {
        return self::formatError($message, $statusCode, $errorMessages);
    }

    /**
     * Format a success response with results and optional pagination meta.
     *
     * @param  array{currentPage?: int, limit?: int, totalResult?: int, totalPages?: int}|null  $meta
     */
    public static function formatResponse(
        mixed $results = null,
        string $message = 'Operation completed successfully.',
        int $statusCode = 200,
        ?array $meta = null
    ): JsonResponse {
        // 1. Direct Paginator instance
        if ($results instanceof LengthAwarePaginator || $results instanceof Paginator) {
            return self::formatPaginatedResponse($results, $message, $statusCode);
        }

        // 2. ResourceCollection wrapping a Paginator
        if ($results instanceof ResourceCollection && ($results->resource instanceof LengthAwarePaginator || $results->resource instanceof Paginator)) {
            return self::formatPaginatedResponse($results->resource, $message, $statusCode, $results->resolve());
        }

        // Resolve Arrayable/Collection/ResourceCollection
        $resolved = $results;
        if ($results instanceof ResourceCollection) {
            $resolved = $results->resolve();
        } elseif ($results instanceof Arrayable) {
            $resolved = $results->toArray();
        }

        // 3. Explicit meta provided
        if ($meta !== null) {
            $total = (int) ($meta['totalResult'] ?? 0);
            if ($total > 10) {
                return new JsonResponse([
                    'statusCode' => $statusCode,
                    'success' => true,
                    'message' => ($message === 'Operation completed successfully.') ? 'Items retrieved successfully.' : $message,
                    'meta' => $meta,
                    'data' => $resolved,
                    'results' => $resolved,
                ], $statusCode);
            }

            return new JsonResponse([
                'statusCode' => $statusCode,
                'success' => true,
                'message' => $message,
                'data' => $resolved,
                'results' => $resolved,
            ], $statusCode);
        }

        // 4. If $resolved is an indexed array/list of items
        if (is_array($resolved) && array_is_list($resolved)) {
            $count = count($resolved);
            if ($count > 10) {
                $limit = (int) request()->query('limit', request()->query('perPage', 10));
                $page = (int) request()->query('page', request()->query('currentPage', 1));
                if ($limit <= 0) {
                    $limit = 10;
                }
                if ($page <= 0) {
                    $page = 1;
                }

                $totalPages = (int) ceil($count / $limit);
                $sliced = array_slice($resolved, ($page - 1) * $limit, $limit);

                return new JsonResponse([
                    'statusCode' => $statusCode,
                    'success' => true,
                    'message' => ($message === 'Operation completed successfully.') ? 'Items retrieved successfully.' : $message,
                    'meta' => [
                        'currentPage' => $page,
                        'limit' => $limit,
                        'totalResult' => $count,
                        'totalPages' => $totalPages,
                    ],
                    'data' => $sliced,
                    'results' => $sliced,
                ], $statusCode);
            }

            // <= 10 items in list
            return new JsonResponse([
                'statusCode' => $statusCode,
                'success' => true,
                'message' => $message,
                'data' => $resolved,
                'results' => $resolved,
            ], $statusCode);
        }

        // 5. Single item (associative array or scalar/object)
        return new JsonResponse([
            'statusCode' => $statusCode,
            'success' => true,
            'message' => $message,
            'data' => $resolved,
            'results' => $resolved,
        ], $statusCode);
    }

    /**
     * Format a paginated response with meta and results.
     */
    public static function formatPaginatedResponse(
        LengthAwarePaginator|Paginator $paginator,
        string $message = 'Items retrieved successfully.',
        int $statusCode = 200,
        mixed $items = null
    ): JsonResponse {
        $total = $paginator instanceof LengthAwarePaginator ? $paginator->total() : $paginator->count();
        $resolvedItems = $items ?? $paginator->items();

        if ($resolvedItems instanceof Arrayable) {
            $resolvedItems = $resolvedItems->toArray();
        }

        if ($total > 10) {
            $meta = [
                'currentPage' => (int) $paginator->currentPage(),
                'limit' => (int) $paginator->perPage(),
                'totalResult' => (int) ($paginator instanceof LengthAwarePaginator ? $paginator->total() : $total),
                'totalPages' => (int) ($paginator instanceof LengthAwarePaginator ? $paginator->lastPage() : 1),
            ];

            return new JsonResponse([
                'statusCode' => $statusCode,
                'success' => true,
                'message' => ($message === 'Operation completed successfully.') ? 'Items retrieved successfully.' : $message,
                'meta' => $meta,
                'data' => $resolvedItems,
                'results' => $resolvedItems,
            ], $statusCode);
        }

        return new JsonResponse([
            'statusCode' => $statusCode,
            'success' => true,
            'message' => ($message === 'Items retrieved successfully.') ? 'Operation completed successfully.' : $message,
            'data' => $resolvedItems,
            'results' => $resolvedItems,
        ], $statusCode);
    }

    /**
     * Format an error response.
     *
     * @param  list<array{path: string, message: string}>  $errorMessages
     */
    public static function formatError(
        string $message = 'An error occurred.',
        int $statusCode = 400,
        array $errorMessages = []
    ): JsonResponse {
        $payload = [
            'statusCode' => $statusCode,
            'success' => false,
            'message' => $message,
        ];

        if (! empty($errorMessages)) {
            $payload['errorMessages'] = $errorMessages;
        }

        return new JsonResponse($payload, $statusCode);
    }
}
