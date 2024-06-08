package andrii.sosnytskyi.nure.safetyshield.adapters

import andrii.sosnytskyi.nure.safetyshield.R
import andrii.sosnytskyi.nure.safetyshield.model.IndividualCondition
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import java.util.Collections.emptyList

class ConditionAdapter : RecyclerView.Adapter<ConditionAdapter.ConditionViewHolder>() {

    // List to hold the conditions that will be displayed in the RecyclerView
    private var conditions: List<IndividualCondition> = emptyList()

    // Inner class representing the ViewHolder for the RecyclerView
    inner class ConditionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val statusTextView: TextView = itemView.findViewById(R.id.statusTextView)
        private val notesTextView: TextView = itemView.findViewById(R.id.notesTextView)

        // Bind the condition data to the TextViews in the ViewHolder
        fun bind(condition: IndividualCondition) {
            statusTextView.text = condition.status
            notesTextView.text = condition.notes
        }
    }

    // Inflate the item layout and create the ViewHolder
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ConditionViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_condition, parent, false)
        return ConditionViewHolder(view)
    }

    // Bind the data to the ViewHolder for the item at the given position
    override fun onBindViewHolder(holder: ConditionViewHolder, position: Int) {
        holder.bind(conditions[position])
    }

    // Return the total number of items in the data set held by the adapter
    override fun getItemCount() = conditions.size

    // Update the conditions list and notify the adapter to refresh the RecyclerView
    fun setConditions(conditions: List<IndividualCondition>) {
        this.conditions = conditions
        notifyDataSetChanged()
    }
}
