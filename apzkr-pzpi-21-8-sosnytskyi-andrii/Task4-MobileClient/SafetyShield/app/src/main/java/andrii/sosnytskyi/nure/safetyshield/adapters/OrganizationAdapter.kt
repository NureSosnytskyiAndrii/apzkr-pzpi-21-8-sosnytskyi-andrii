/*
package andrii.sosnytskyi.nure.safetyshield.adapters

import andrii.sosnytskyi.nure.safetyshield.R
import andrii.sosnytskyi.nure.safetyshield.model.Organization
import android.provider.ContactsContract
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class OrganizationAdapter(private var organizations: List<Organization>) : RecyclerView.Adapter<OrganizationAdapter.OrganizationViewHolder>() {

    inner class OrganizationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nameTextView: TextView = itemView.findViewById(R.id.nameTextView)
        val activityTextView: TextView = itemView.findViewById(R.id.activityTextView)
        val addressTextView: TextView = itemView.findViewById(R.id.addressTextView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrganizationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_organization, parent, false)
        return OrganizationViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrganizationViewHolder, position: Int) {
        val organization = organizations[position]
        holder.nameTextView.text = organization.organization_name
        holder.activityTextView.text = organization.organization_activity
        holder.addressTextView.text = organization.address
    }

    override fun getItemCount(): Int {
        return organizations.size
    }

    // Функция для обновления данных списка организаций
    fun updateData(newList: List<Organization>) {
        organizations = newList
        notifyDataSetChanged()
    }
}
*/

package andrii.sosnytskyi.nure.safetyshield.adapters

import andrii.sosnytskyi.nure.safetyshield.R
import andrii.sosnytskyi.nure.safetyshield.model.Organization
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class OrganizationAdapter(private var organizations: List<Organization>) : RecyclerView.Adapter<OrganizationAdapter.OrganizationViewHolder>() {

    inner class OrganizationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nameTextView: TextView = itemView.findViewById(R.id.nameTextView)
        val activityTextView: TextView = itemView.findViewById(R.id.activityTextView)
        val addressTextView: TextView = itemView.findViewById(R.id.addressTextView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrganizationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_organization, parent, false)
        return OrganizationViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrganizationViewHolder, position: Int) {
        val organization = organizations[position]
        holder.nameTextView.text = organization.organization_name
        holder.activityTextView.text = organization.organization_activity
        holder.addressTextView.text = organization.address
    }

    override fun getItemCount(): Int {
        return organizations.size
    }

    // Функция для обновления данных списка организаций
    fun updateData(newList: List<Organization>) {
        organizations = newList
        notifyDataSetChanged()
    }
}
