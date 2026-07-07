import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';

@Module({
  controllers: [ProposalController, QuotationController],
  providers: [ProposalService, QuotationService],
  exports: [ProposalService, QuotationService],
})
export class ProposalModule {}
