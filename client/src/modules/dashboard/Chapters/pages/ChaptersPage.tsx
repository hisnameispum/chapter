import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement } from 'react';

import { checkPermission } from '../../../../util/check-permission';
import { useDashboardChaptersQuery } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import { Permission } from '../../../../../../common/permissions';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useAuth } from 'modules/auth/store';

export const ChaptersPage: NextPageWithLayout = () => {
  const { loading, error, data } = useDashboardChaptersQuery();
  const { user, loadingUser } = useAuth();

  const hasPermissionToCreateChapter = checkPermission(
    user,
    Permission.ChapterCreate,
  );

  const isLoading = loading || loadingUser || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <VStack>
      <Flex w="full" justify="space-between">
        <Heading data-cy="chapter-dash-heading" id="page-heading">
          Chapters
        </Heading>
        {hasPermissionToCreateChapter && (
          <LinkButton
            data-cy="new-chapter"
            href="/dashboard/chapters/new"
            colorScheme={'blue'}
          >
            Add new
          </LinkButton>
        )}
      </Flex>
      <Box display={{ base: 'none', lg: 'block' }} width="100%">
        <DataTable
          data={data.dashboardChapters}
          keys={['name', 'actions'] as const}
          tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
          mapper={{
            name: (chapter) => (
              <LinkButton
                data-cy="chapter"
                href={`/dashboard/chapters/${chapter.id}`}
              >
                {chapter.name}
              </LinkButton>
            ),
            actions: (chapter) => (
              <HStack>
                <LinkButton
                  colorScheme="blue"
                  size="xs"
                  href={`/dashboard/chapters/${chapter.id}/new-venue`}
                >
                  Add Venue
                </LinkButton>
                <LinkButton
                  colorScheme="blue"
                  size="xs"
                  href={`/dashboard/chapters/${chapter.id}/new-event`}
                >
                  Add Event
                </LinkButton>
                <LinkButton
                  colorScheme="blue"
                  size="xs"
                  href={`/dashboard/chapters/${chapter.id}/edit`}
                >
                  Edit
                </LinkButton>
              </HStack>
            ),
          }}
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
        {data.dashboardChapters.map((chapter) => (
          <Flex key={chapter.id}>
            <DataTable
              data={[chapter]}
              keys={['type', 'actions'] as const}
              showHeader={false}
              tableProps={{
                table: { 'aria-labelledby': 'page-heading' },
              }}
              mapper={{
                type: () => (
                  <VStack
                    align={'flex-start'}
                    spacing={'4'}
                    fontSize={['sm', 'md']}
                    marginBlock={'1.5em'}
                  >
                    <Heading as="h3" fontSize={['sm', 'md']} marginBlock={'1'}>
                      Name
                    </Heading>
                    <Heading as="h3" fontSize={['sm', 'md']}>
                      Actions
                    </Heading>
                  </VStack>
                ),
                actions: () => (
                  <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                    <LinkButton
                      data-cy="chapter"
                      href={`/dashboard/chapters/${chapter.id}`}
                      marginBottom={'.5em'}
                      width="100%"
                      size={'sm'}
                    >
                      {chapter.name}
                    </LinkButton>
                    <HStack spacing={1} marginLeft={'-1em'}>
                      <LinkButton
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/chapters/${chapter.id}/new-venue`}
                      >
                        Add Venue
                      </LinkButton>
                      <LinkButton
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/chapters/${chapter.id}/new-event`}
                      >
                        Add Event
                      </LinkButton>
                      <LinkButton
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/chapters/${chapter.id}/edit`}
                      >
                        Edit
                      </LinkButton>
                    </HStack>
                  </VStack>
                ),
              }}
            />
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

ChaptersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
